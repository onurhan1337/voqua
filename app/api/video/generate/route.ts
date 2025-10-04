import { createClient } from "@/lib/supabase/server";
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
  output?: {
    video?: {
      url: string;
      content_type: string;
      file_name: string;
      file_size: number;
    };
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

const VOICE_ID_MAP: Record<string, string> = {
  Rachel: "21m00Tcm4TlvDq8ikWAM",
  Domi: "AZnzlk1XvdvUeBnXmlld",
  Bella: "EXAVITQu4vr4xnSDxMaL",
  Antoni: "ErXwobaYiN019PkySvjV",
  Elli: "MF3mGyEYCl7XYWbV9V6O",
  Josh: "TxGEqnHWrfWFTfGW9XjX",
  Arnold: "VR6AewLTigWG4xSOukaG",
  Adam: "pNInz6obpgDQGcFmaJgB",
  Sam: "yoZ06aMxZJJ28mfd3POQ",
};

const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365;

function extractVideoUrl(result: FalWorkflowResult): string {
  const videoUrl = result.video?.url || result.output?.video?.url;
  if (!videoUrl) {
    throw new Error(
      `No video URL found in workflow result. Available keys: ${Object.keys(
        result
      ).join(", ")}`
    );
  }
  return videoUrl;
}

async function downloadVideo(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}

async function uploadToStorage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  videoId: string,
  videoBuffer: Buffer
) {
  const fileName = `${userId}/${videoId}/video.mp4`;
  const { error: uploadError } = await supabase.storage
    .from("user-videos")
    .upload(fileName, videoBuffer, {
      contentType: "video/mp4",
      upsert: false,
    });

  if (uploadError)
    throw new Error(`Failed to upload video: ${uploadError.message}`);

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("user-videos")
    .createSignedUrl(fileName, SIGNED_URL_EXPIRY);

  if (signedUrlError || !signedUrlData)
    throw new Error("Failed to create signed URL for video");

  return signedUrlData.signedUrl;
}

async function updateVideoStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  videoId: string,
  status: string,
  additionalData?: Record<string, unknown>
) {
  const { error } = await supabase
    .from("generated_videos")
    .update({ status, ...additionalData })
    .eq("id", videoId);

  if (error) {
    console.error(`Failed to update video status to ${status}:`, error);
    throw new Error(`Failed to update video status: ${error.message}`);
  }

  console.log(`✅ Video status updated to: ${status} for video: ${videoId}`);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: GenerateVideoRequest = await request.json();
    const { avatar_id, script, voice } = body;

    if (!avatar_id || !script || !voice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!VALID_VOICES.includes(voice)) {
      return NextResponse.json({ error: "Invalid voice" }, { status: 400 });
    }

    const { data: avatar } = await supabase
      .from("avatar_previews")
      .select("*")
      .eq("id", avatar_id)
      .single();

    if (!avatar) {
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
      return NextResponse.json(
        { error: "Failed to create video record" },
        { status: 500 }
      );
    }

    await updateVideoStatus(supabase, videoRecord.id, "processing");

    const cleanScript = script
      .replace(/[\r\n\t]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const voiceId = VOICE_ID_MAP[voice];
    if (!voiceId) {
      console.error("Invalid voice:", voice);
      await updateVideoStatus(supabase, videoRecord.id, "failed", {
        error_message: `Invalid voice: ${voice}`,
      });
      return NextResponse.json(
        { error: `Invalid voice: ${voice}` },
        { status: 400 }
      );
    }

    const inputPayload = {
      video_url: avatar.video_url,
      text: cleanScript,
      voice: voiceId,
      speaker: "narrator",
      prompt: [
        {
          text: cleanScript,
          speaker: "narrator",
          voice: voiceId,
        },
      ],
    };

    console.log("FAL Input Payload:", JSON.stringify(inputPayload, null, 2));
    console.log("Avatar video_url:", avatar.video_url);
    console.log("Script length:", script.length);
    console.log("Voice:", voice, "-> Voice ID:", voiceId);

    if (!avatar.video_url || !avatar.video_url.startsWith("http")) {
      console.error("Invalid video URL:", avatar.video_url);
      await updateVideoStatus(supabase, videoRecord.id, "failed", {
        error_message: "Invalid avatar video URL",
      });
      return NextResponse.json(
        { error: "Invalid avatar video URL" },
        { status: 400 }
      );
    }

    let stream;
    try {
      stream = await fal.stream("workflows/onurhan1337/voqua", {
        input: inputPayload,
      });
      console.log("✅ Stream created successfully");
    } catch (streamError) {
      const errorMessage =
        streamError instanceof Error
          ? streamError.message
          : String(streamError);
      console.error("❌ Failed to create stream:", streamError);
      await updateVideoStatus(supabase, videoRecord.id, "failed", {
        error_message: `Stream creation failed: ${errorMessage}`,
      });
      throw new Error(`Failed to create fal.ai stream: ${errorMessage}`);
    }

    for await (const event of stream) {
      console.log("Stream event:", event.type, event);
      if (event.type === "progress") {
        await updateVideoStatus(supabase, videoRecord.id, "processing", {
          progress: JSON.stringify(event),
        });
      } else if (event.type === "error") {
        console.error("Stream error:", event);
        await updateVideoStatus(supabase, videoRecord.id, "failed", {
          error_message: JSON.stringify(event),
        });
        throw new Error(`Stream error: ${JSON.stringify(event)}`);
      }
    }

    const result = (await stream.done()) as FalWorkflowResult;

    if (result.error || result.type === "error") {
      const errorMessage = result.message || result.error || "Workflow failed";

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

    console.log("🎬 Extracting video URL from result...");
    const videoUrl = extractVideoUrl(result);
    console.log("📥 Video URL extracted:", videoUrl);

    console.log("⬇️ Downloading video...");
    const videoBuffer = await downloadVideo(videoUrl);
    console.log("✅ Video downloaded, size:", videoBuffer.length, "bytes");

    console.log("☁️ Uploading to Supabase storage...");
    const signedUrl = await uploadToStorage(
      supabase,
      user.id,
      videoRecord.id,
      videoBuffer
    );
    console.log("✅ Video uploaded, signed URL:", signedUrl);

    console.log("📝 Updating video status to completed...");
    try {
      await updateVideoStatus(supabase, videoRecord.id, "completed", {
        video_url: signedUrl,
        error_message: null,
      });
      console.log("🎉 Video generation completed successfully!");
    } catch (statusError) {
      const errorMessage =
        statusError instanceof Error
          ? statusError.message
          : String(statusError);
      console.error("❌ Failed to update status to completed:", statusError);
      throw new Error(
        `Video generated but failed to update status: ${errorMessage}`
      );
    }

    return NextResponse.json({
      id: videoRecord.id,
      status: "completed",
      video_url: signedUrl,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate video";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
