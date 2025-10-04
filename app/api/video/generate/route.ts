import { createClient } from "@/lib/supabase/server";
import { createRequestLogger } from "@/lib/logger";
import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_API_KEY!,
});

interface GenerateVideoRequest {
  avatar_id: string;
  script: string;
  voice: string;
}

interface FalWorkflowResult {
  video?: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
  error?: string;
  type?: string;
  message?: string;
  node_id?: string;
}

const VALID_VOICES = [
  "Rachel",
  "Domi",
  "Bella",
  "Antoni",
  "Elli",
  "Josh",
  "Arnold",
  "Adam",
  "Sam",
];

const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365;

function extractVideoUrl(result: FalWorkflowResult): string {
  if (!result.video?.url) {
    throw new Error(
      `No video URL found in workflow result. Available keys: ${Object.keys(
        result
      ).join(", ")}`
    );
  }
  return result.video.url;
}

async function downloadVideo(
  url: string,
  logger: ReturnType<typeof createRequestLogger>
) {
  logger.info({ url }, "Downloading video from FAL");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  logger.info({ sizeBytes: buffer.length }, "Video downloaded successfully");

  return buffer;
}

async function uploadToStorage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  videoId: string,
  videoBuffer: Buffer,
  logger: ReturnType<typeof createRequestLogger>
) {
  const fileName = `${userId}/${videoId}/video.mp4`;

  logger.info({ fileName }, "Uploading video to storage");

  const { error: uploadError } = await supabase.storage
    .from("user-videos")
    .upload(fileName, videoBuffer, {
      contentType: "video/mp4",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload video: ${uploadError.message}`);
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("user-videos")
    .createSignedUrl(fileName, SIGNED_URL_EXPIRY);

  if (signedUrlError || !signedUrlData) {
    throw new Error("Failed to create signed URL for video");
  }

  logger.info({ fileName }, "Video uploaded successfully");

  return signedUrlData.signedUrl;
}

async function updateVideoStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  videoId: string,
  status: string,
  additionalData?: Record<string, unknown>
) {
  await supabase
    .from("generated_videos")
    .update({ status, ...additionalData })
    .eq("id", videoId);
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  let logger = createRequestLogger("unknown", requestId);

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("Unauthorized video generation attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger = createRequestLogger(user.id, requestId);

    const body: GenerateVideoRequest = await request.json();
    const { avatar_id, script, voice } = body;

    logger.info(
      { avatar_id, scriptLength: script?.length, voice },
      "Video generation request received"
    );

    if (!avatar_id || !script || !voice) {
      logger.warn(
        { avatar_id, hasScript: !!script, voice },
        "Missing required fields"
      );
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!VALID_VOICES.includes(voice)) {
      logger.warn({ voice }, "Invalid voice selected");
      return NextResponse.json({ error: "Invalid voice" }, { status: 400 });
    }

    const { data: avatar } = await supabase
      .from("avatar_previews")
      .select("*")
      .eq("id", avatar_id)
      .single();

    if (!avatar) {
      logger.warn({ avatar_id }, "Avatar not found");
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    const { data: videoRecord, error: insertError } = await supabase
      .from("generated_videos")
      .insert({
        user_id: user.id,
        avatar_id,
        script,
        voice_settings: { voice },
        status: "pending",
      })
      .select()
      .single();

    if (insertError || !videoRecord) {
      logger.error({ error: insertError }, "Failed to create video record");
      return NextResponse.json(
        { error: "Failed to create video record" },
        { status: 500 }
      );
    }

    logger = logger.child({ videoId: videoRecord.id });
    logger.info("Video record created, starting workflow");

    await updateVideoStatus(supabase, videoRecord.id, "processing");

    logger.info({ voice }, "Starting FAL workflow");

    const stream = await fal.stream("workflows/onurhan1337/voqua", {
      input: {
        video_url: avatar.video_url,
        prompt: [
          {
            text: script,
            speaker: "narrator",
            voice,
          },
        ],
      },
    });

    for await (const event of stream) {
      if (event.type === "progress") {
        logger.debug({ event }, "Workflow progress event");
        await updateVideoStatus(supabase, videoRecord.id, "processing", {
          error_message: JSON.stringify(event),
        });
      }
    }

    const result = (await stream.done()) as FalWorkflowResult;

    logger.info({ resultKeys: Object.keys(result) }, "Workflow completed");

    if (result.error || result.type === "error") {
      const errorMessage = result.message || result.error || "Workflow failed";
      logger.error(
        {
          type: result.type,
          message: result.message,
          error: result.error,
          node_id: result.node_id,
        },
        "Workflow error"
      );

      await updateVideoStatus(supabase, videoRecord.id, "failed", {
        error_message: JSON.stringify({
          type: result.type,
          message: result.message,
          error: result.error,
          node_id: result.node_id,
        }),
      });

      throw new Error(`Workflow error: ${errorMessage}`);
    }

    const videoUrl = extractVideoUrl(result);
    const videoBuffer = await downloadVideo(videoUrl, logger);
    const signedUrl = await uploadToStorage(
      supabase,
      user.id,
      videoRecord.id,
      videoBuffer,
      logger
    );

    await updateVideoStatus(supabase, videoRecord.id, "completed", {
      video_url: signedUrl,
      error_message: null,
    });

    logger.info("Video generation completed successfully");

    return NextResponse.json({
      id: videoRecord.id,
      status: "completed",
      video_url: signedUrl,
    });
  } catch (error) {
    logger.error({ error }, "Video generation failed");
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate video";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
