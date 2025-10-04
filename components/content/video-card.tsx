"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Play, Download, Calendar } from "lucide-react";
import { useState, useRef } from "react";
import { useDownload } from "@/hooks/use-download";

interface Video {
  id: string;
  script: string;
  status: string;
  video_url: string | null;
  created_at: string;
  avatar: { name: string } | null;
}

interface VideoCardProps {
  video: Video;
  isNewVideo?: boolean;
}

export function VideoCard({ video, isNewVideo = false }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDownloading, downloadVideo } = useDownload();

  const avatarName = video.avatar?.name || "Unknown";
  const createdDate = new Date(video.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDownload = () => {
    downloadVideo(video.id);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 ${
        isNewVideo ? "ring-2 ring-blue-500" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col">
        <div className="relative">
          <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden rounded-t-lg">
            {video.video_url && video.status === "completed" ? (
              <>
                <video
                  ref={videoRef}
                  src={`/api/video/${video.id}`}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                {isHovered && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center" />
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                  {video.status === "processing" ? (
                    <Spinner className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
            )}
          </div>
          <Badge
            variant={video.status === "completed" ? "default" : "secondary"}
            className="absolute top-2 left-2"
          >
            {video.status}
          </Badge>
          {isNewVideo && (
            <Badge className="absolute top-2 right-2 bg-blue-500">New!</Badge>
          )}
        </div>

        <div className="p-4">
          <CardTitle className="text-lg mb-2 line-clamp-2">
            {video.script}
          </CardTitle>
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {createdDate}
            </div>
            <span>•</span>
            <span>{avatarName}</span>
          </div>

          <div className="flex gap-2">
            {video.status === "completed" && video.video_url ? (
              <>
                <Button
                  size="sm"
                  className="flex-1 hover:outline-dashed hover:outline-orange-800 hover:outline-1 hover:outline-offset-2"
                  onClick={() =>
                    window.open(`/api/video/${video.id}`, "_blank")
                  }
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Video
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Spinner className="h-4 w-4 mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isDownloading ? "Downloading..." : "Download"}
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" disabled className="flex-1">
                <Spinner className="h-4 w-4 mr-2" />
                Processing...
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
