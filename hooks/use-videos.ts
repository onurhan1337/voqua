"use client";

import { useQuery } from "@tanstack/react-query";
import { getVideos, getVideoStats } from "@/lib/api/videos";

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useVideoStats() {
  return useQuery({
    queryKey: ["video-stats"],
    queryFn: getVideoStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
