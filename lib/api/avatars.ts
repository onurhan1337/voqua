import { createClient } from "@/lib/supabase/server";

export interface Avatar {
  id: string;
  name: string;
  description: string;
  style: string;
  voice: string;
  thumbnail_url?: string;
  video_url?: string;
  created_at: string;
}

export async function getAvatars(): Promise<Avatar[]> {
  const supabase = await createClient();

  const { data: avatars, error } = await supabase
    .from("avatar_previews")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading avatars:", error);
    throw new Error("Failed to load avatars");
  }

  return avatars || [];
}

export async function getAvatarCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("avatar_previews")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error loading avatar count:", error);
    throw new Error("Failed to load avatar count");
  }

  return count || 0;
}
