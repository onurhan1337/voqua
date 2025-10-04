import { createClient } from "@/lib/supabase/server";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Eye, Clock, Download } from "lucide-react";
import Link from "next/link";
import { VideoList } from "./page-client";

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

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
        <SidebarTrigger />
      </header>

      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
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
                  <Link href="/dashboard/creators">
                    Create Your First Video
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Play className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">3</p>
                    <p className="text-sm text-neutral-500">Total Videos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">2</p>
                    <p className="text-sm text-neutral-500">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">1</p>
                    <p className="text-sm text-neutral-500">Processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Download className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">2.5m</p>
                    <p className="text-sm text-neutral-500">Total Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
