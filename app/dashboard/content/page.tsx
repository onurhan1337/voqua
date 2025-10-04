import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Eye, Clock, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { VideoList } from "./page-client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

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

  // Calculate analytics data
  const totalVideos = videos?.length || 0;
  const completedVideos =
    videos?.filter((video) => video.status === "completed").length || 0;
  const processingVideos =
    videos?.filter((video) => video.status === "processing").length || 0;
  const totalDuration =
    (videos?.filter((video) => video.status === "completed").length || 0) * 2.5; // Assuming 2.5 minutes per video

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
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Total Videos
                    </p>
                    <p className="text-2xl font-bold">{totalVideos}</p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/20 shadow-inner flex items-center justify-center">
                    <Play className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Completed
                    </p>
                    <p className="text-2xl font-bold">{completedVideos}</p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-green-100 border border-green-900/20 shadow-inner flex items-center justify-center">
                    <Eye className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Processing
                    </p>
                    <p className="text-2xl font-bold">{processingVideos}</p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-yellow-100 border border-yellow-900/20 shadow-inner flex items-center justify-center">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Total Duration
                    </p>
                    <p className="text-2xl font-bold">
                      {totalDuration.toFixed(1)}m
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-purple-100 border border-purple-900/20 shadow-inner flex items-center justify-center">
                    <Download className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {videos && videos.length > 0 ? (
          <VideoList videos={videos} highlightedVideoId={params.video_id} />
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                No videos yet
              </h3>
              <p className="text-neutral-500 mb-6">
                Create your first UGC video by selecting an avatar and
                generating content
              </p>
              <Button asChild>
                <Link href="/dashboard/creators">Create Your First Video</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
