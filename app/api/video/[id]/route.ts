import { createClient } from "@/lib/supabase/server";
import { createRequestLogger } from "@/lib/logger";
import { NextResponse } from "next/server";

const SIGNED_URL_EXPIRY = 60 * 60;

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger = createRequestLogger(user.id, requestId).child({
      videoId: id,
      isDownload,
    });

    const { data: video } = await supabase
      .from("generated_videos")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!video) {
      logger.warn("Video not found");
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const videoPath = `${user.id}/${video.id}/video.mp4`;

    const { data: signedUrl, error } = await supabase.storage
      .from("user-videos")
      .createSignedUrl(videoPath, SIGNED_URL_EXPIRY);

    if (error || !signedUrl) {
      logger.error({ error }, "Failed to create signed URL");
      return NextResponse.json(
        { error: "Failed to get video URL" },
        { status: 500 }
      );
    }

    if (isDownload) {
      logger.info("Redirecting to download");
      return NextResponse.redirect(signedUrl.signedUrl);
    }

    logger.info("Fetching and streaming video");
    const response = await fetch(signedUrl.signedUrl);
    const videoBuffer = await response.arrayBuffer();

    logger.info(
      { sizeBytes: videoBuffer.byteLength },
      "Video fetched successfully"
    );

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch video");
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
