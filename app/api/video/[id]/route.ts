import { createClient } from "@/lib/supabase/server";
import { createRequestLogger } from "@/lib/logger";
import { NextResponse } from "next/server";
import {
  SIGNED_URL_EXPIRY,
  USER_VIDEOS_BUCKET,
  VIDEO_CONTENT_TYPE,
} from "@/lib/video/constants";
import { VideoErrorResponse } from "@/lib/video/types";

async function getVideoRecord(
  supabase: Awaited<ReturnType<typeof createClient>>,
  videoId: string,
  userId: string
) {
  const { data: video } = await supabase
    .from("generated_videos")
    .select("*")
    .eq("id", videoId)
    .eq("user_id", userId)
    .single();

  return video;
}

async function createVideoSignedUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  videoId: string
) {
  const videoPath = `${userId}/${videoId}/video.mp4`;

  const { data: signedUrl, error } = await supabase.storage
    .from(USER_VIDEOS_BUCKET)
    .createSignedUrl(videoPath, SIGNED_URL_EXPIRY);

  if (error || !signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }

  return signedUrl.signedUrl;
}

async function streamVideo(signedUrl: string) {
  const response = await fetch(signedUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }

  return response.arrayBuffer();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = crypto.randomUUID();
  let logger = createRequestLogger("unknown", requestId);

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get("download") === "true";

    logger = logger.child({ videoId: id, isDownload });
    logger.info("Video fetch request received");

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logger.warn("Unauthorized video fetch attempt");
      return NextResponse.json(
        { error: "Unauthorized" } as VideoErrorResponse,
        { status: 401 }
      );
    }

    logger = createRequestLogger(user.id, requestId).child({
      videoId: id,
      isDownload,
    });

    const video = await getVideoRecord(supabase, id, user.id);

    if (!video) {
      logger.warn("Video not found");
      return NextResponse.json(
        { error: "Video not found" } as VideoErrorResponse,
        { status: 404 }
      );
    }

    const signedUrl = await createVideoSignedUrl(supabase, user.id, video.id);

    if (isDownload) {
      logger.info("Redirecting to download");
      return NextResponse.redirect(signedUrl);
    }

    logger.info("Fetching and streaming video");
    const videoBuffer = await streamVideo(signedUrl);

    logger.info(
      { sizeBytes: videoBuffer.byteLength },
      "Video fetched successfully"
    );

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": VIDEO_CONTENT_TYPE,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch video");
    return NextResponse.json(
      { error: "Failed to fetch video" } as VideoErrorResponse,
      { status: 500 }
    );
  }
}
