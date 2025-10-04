"use client";

import { VideoList } from "./video-list";
import { EmptyVideosState } from "./empty-videos-state";
import { useVideos } from "@/hooks/use-videos";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoListClientProps {
  highlightedVideoId?: string;
}

export function VideoListClient({ highlightedVideoId }: VideoListClientProps) {
  const { data: videos, isLoading, error } = useVideos();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load videos: {error.message}</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return <EmptyVideosState />;
  }

  return <VideoList videos={videos} highlightedVideoId={highlightedVideoId} />;
}
