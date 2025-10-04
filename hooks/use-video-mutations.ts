"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteVideoParams {
  videoId: string;
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId }: DeleteVideoParams) => {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete video");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["video-stats"] });
      toast.success("Video deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete video: ${error.message}`);
    },
  });
}

export function useRefreshVideos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["videos"] }),
        queryClient.invalidateQueries({ queryKey: ["video-stats"] }),
      ]);
    },
    onSuccess: () => {
      toast.success("Videos refreshed");
    },
    onError: (error) => {
      toast.error(`Failed to refresh videos: ${error.message}`);
    },
  });
}
