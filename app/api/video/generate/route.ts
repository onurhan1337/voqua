import { createClient } from "@/lib/supabase/server";
import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";
import {
  GenerateVideoRequest,
  FalWorkflowResult,
  VideoGenerationResponse,
  VideoErrorResponse,
  Avatar,
  FalInputPayload,
} from "@/lib/video/types";
import { VALID_VOICES, VOICE_ID_MAP } from "@/lib/video/constants";
import {
  extractVideoUrl,
  downloadVideo,
  uploadToStorage,
  updateVideoStatus,
  cleanScript,
  validateVideoUrl,
} from "@/lib/video/utils";

fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_API_KEY!,
});

async function validateRequest(body: GenerateVideoRequest) {
  const { avatar_id, script, voice } = body;

  if (!avatar_id || !script || !voice) {
    throw new Error("Missing required fields");
  }

  if (!VALID_VOICES.includes(voice)) {
    throw new Error("Invalid voice");
  }
}

async function getAvatar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  avatarId: string
): Promise<Avatar> {
  const { data: avatar } = await supabase
    .from("avatar_previews")
    .select("*")
    .eq("id", avatarId)
    .single();

  if (!avatar) {
    throw new Error("Avatar not found");
  }

  if (!validateVideoUrl(avatar.video_url)) {
    throw new Error("Invalid avatar video URL");
  }

  return avatar;
}

async function createVideoRecord(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  avatarId: string,
  script: string,
  voice: string
) {
  const { data: videoRecord, error: insertError } = await supabase
    .from("generated_videos")
    .insert({
      user_id: userId,
      avatar_id: avatarId,
      script,
      voice_settings: { voice },
      status: "pending",
    })
    .select()
    .single();

  if (insertError || !videoRecord) {
    throw new Error("Failed to create video record");
  }

  return videoRecord;
}

function createFalInputPayload(
  avatar: Avatar,
  script: string,
  voiceId: string
): FalInputPayload {
  return {
    video_url: avatar.video_url,
    text: script,
    voice: voiceId,
    speaker: "narrator",
    prompt: [
      {
        text: script,
        speaker: "narrator",
        voice: voiceId,
      },
    ],
  };
}

async function processFalWorkflow(
  inputPayload: FalInputPayload,
  videoId: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<FalWorkflowResult> {
  let stream;
  try {
    stream = await fal.stream("workflows/onurhan1337/voqua", {
      input: inputPayload,
    });
  } catch (streamError) {
    const errorMessage =
      streamError instanceof Error ? streamError.message : String(streamError);
    await updateVideoStatus(supabase, videoId, "failed", {
      error_message: `Stream creation failed: ${errorMessage}`,
    });
    throw new Error(`Failed to create fal.ai stream: ${errorMessage}`);
  }

  for await (const event of stream) {
    if (event.type === "progress") {
      await updateVideoStatus(supabase, videoId, "processing", {
        progress: JSON.stringify(event),
      });
    } else if (event.type === "error") {
      await updateVideoStatus(supabase, videoId, "failed", {
        error_message: JSON.stringify(event),
      });
      throw new Error(`Stream error: ${JSON.stringify(event)}`);
    }
  }

  const result = (await stream.done()) as FalWorkflowResult;

  if (result.error || result.type === "error") {
    const errorMessage = result.message || result.error || "Workflow failed";
    await updateVideoStatus(supabase, videoId, "failed", {
      error_message: JSON.stringify({
        type: result.type,
        message: result.message,
        error: result.error,
        node_id: result.node_id,
      }),
    });
    throw new Error(`Workflow error: ${errorMessage}`);
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" } as VideoErrorResponse,
        { status: 401 }
      );
    }

    const body: GenerateVideoRequest = await request.json();
    await validateRequest(body);

    const { avatar_id, script, voice } = body;
    const avatar = await getAvatar(supabase, avatar_id);
    const videoRecord = await createVideoRecord(
      supabase,
      user.id,
      avatar_id,
      script,
      voice
    );

    await updateVideoStatus(supabase, videoRecord.id, "processing");

    const cleanScriptText = cleanScript(script);
    const voiceId = VOICE_ID_MAP[voice];

    if (!voiceId) {
      await updateVideoStatus(supabase, videoRecord.id, "failed", {
        error_message: `Invalid voice: ${voice}`,
      });
      return NextResponse.json(
        { error: `Invalid voice: ${voice}` } as VideoErrorResponse,
        { status: 400 }
      );
    }

    const inputPayload = createFalInputPayload(
      avatar,
      cleanScriptText,
      voiceId
    );
    const result = await processFalWorkflow(
      inputPayload,
      videoRecord.id,
      supabase
    );

    const videoUrl = extractVideoUrl(result);
    const videoBuffer = await downloadVideo(videoUrl);
    const signedUrl = await uploadToStorage(
      supabase,
      user.id,
      videoRecord.id,
      videoBuffer
    );

    await updateVideoStatus(supabase, videoRecord.id, "completed", {
      video_url: signedUrl,
      error_message: null,
    });

    return NextResponse.json({
      id: videoRecord.id,
      status: "completed",
      video_url: signedUrl,
    } as VideoGenerationResponse);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate video";
    return NextResponse.json({ error: errorMessage } as VideoErrorResponse, {
      status: 500,
    });
  }
}
