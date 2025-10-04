import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VideoStatsCards } from "@/components/content/video-stats-cards";
import { VideoList } from "@/components/content/video-list";
import { EmptyVideosState } from "@/components/content/empty-videos-state";

interface Video {
  id: string;
  script: string;
  status: string;
  video_url: string | null;
  created_at: string;
  avatar: { name: string } | null;
}

interface PageProps {
  searchParams: Promise<{
    video_id?: string;
  }>;
}

export default async function ContentPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: videos, error } = await supabase
    .from("generated_videos")
    .select(
      `
      *,
      avatar:avatar_previews(name)
    `
    )
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading videos:", error);
  }

  function calculateVideoStats(videos: Video[]) {
    const totalVideos = videos.length;
    const completedVideos = videos.filter(
      (video) => video.status === "completed"
    ).length;
    const processingVideos = videos.filter(
      (video) => video.status === "processing"
    ).length;
    const totalDuration = completedVideos * 2.5; // Assuming 2.5 minutes per video

    return {
      totalVideos,
      completedVideos,
      processingVideos,
      totalDuration,
    };
  }

  const stats = calculateVideoStats(videos || []);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col gap-0">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2 text-balance tracking-tight">
                Your Videos
              </h2>
              <p className="text-neutral-600 text-balance">
                View and manage all your generated UGC videos
              </p>
            </div>
            <Button
              asChild
              className="outline-dashed outline-amber-600 outline-1 outline-offset-2"
            >
              <Link href="/dashboard/creators">Create New Video</Link>
            </Button>
          </div>
          <VideoStatsCards stats={stats} />
        </div>
        {videos && videos.length > 0 ? (
          <VideoList videos={videos} highlightedVideoId={params.video_id} />
        ) : (
          <EmptyVideosState />
        )}
      </div>
    </div>
  );
}
