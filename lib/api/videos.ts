import { createClient } from "@/lib/supabase/server";

export interface VideoStats {
  totalVideos: number;
  completedVideos: number;
  processingVideos: number;
  totalDuration: number;
}

export interface Video {
  id: string;
  script: string;
  status: string;
  video_url: string | null;
  created_at: string;
  avatar: { name: string } | null;
}

export async function getVideos(): Promise<Video[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: videos, error } = await supabase
    .from("generated_videos")
    .select(
      `
      *,
      avatar:avatar_previews(name)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading videos:", error);
    throw new Error("Failed to load videos");
  }

  return (videos || []).map((video) => ({
    ...video,
    avatar: video.avatar || null,
  }));
}

export async function getVideoStats(): Promise<VideoStats> {
  const videos = await getVideos();

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

export async function getRecentVideos(limit = 3): Promise<Video[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: videos, error } = await supabase
    .from("generated_videos")
    .select(
      `
      id,
      script,
      status,
      video_url,
      created_at,
      avatar:avatar_previews(name)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error loading recent videos:", error);
    throw new Error("Failed to load recent videos");
  }

  return (videos || []).map((video) => ({
    ...video,
    avatar: video.avatar && video.avatar.length > 0 ? video.avatar[0] : null,
  }));
}
