"use client";

import { useQuery } from "@tanstack/react-query";
import { getVideos, getVideoStats } from "@/lib/api/videos";

export function useVideosRealtime() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
    refetchInterval: 10000,
    staleTime: 5 * 1000,
    retry: 2,
  });
}

export function useVideoStatsRealtime() {
  return useQuery({
    queryKey: ["video-stats"],
    queryFn: getVideoStats,
    refetchInterval: 10000,
    staleTime: 5 * 1000,
    retry: 2,
  });
}
