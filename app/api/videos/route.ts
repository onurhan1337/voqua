import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getVideos, getVideoStats } from "@/lib/api/videos";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get("stats") === "true";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (stats) {
      const videoStats = await getVideoStats();
      return NextResponse.json(videoStats);
    }

    const videos = await getVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error in videos API:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
