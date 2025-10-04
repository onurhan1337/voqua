import { VideoCard } from "./video-card";

interface Video {
  id: string;
  script: string;
  status: string;
  video_url: string | null;
  created_at: string;
  avatar: { name: string } | null;
}

interface VideoListProps extends React.HTMLAttributes<HTMLDivElement> {
  videos: Video[];
  highlightedVideoId?: string;
}

export function VideoList({
  videos,
  highlightedVideoId,
  ...props
}: VideoListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" {...props}>
      {videos.map((video) => {
        const isNewVideo = highlightedVideoId === video.id;
        return (
          <VideoCard key={video.id} video={video} isNewVideo={isNewVideo} />
        );
      })}
    </div>
  );
}
