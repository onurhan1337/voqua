import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VideoStatsCardsClient } from "@/components/content/video-stats-cards-client";
import { VideoListClient } from "@/components/content/video-list-client";

interface PageClientProps {
  searchParams: Promise<{
    video_id?: string;
  }>;
}

export default async function ContentPageClient({
  searchParams,
}: PageClientProps) {
  const params = await searchParams;

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
          <VideoStatsCardsClient />
        </div>
        <VideoListClient highlightedVideoId={params.video_id} />
      </div>
    </div>
  );
}
