import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CreateVideoClient } from "@/app/dashboard/content/create/create-video-client";

interface AvatarPreview {
  id: string;
  name: string;
  style: string;
  voice: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  story: string | null;
  accent: string | null;
}

async function getAvatars(): Promise<AvatarPreview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("avatar_previews")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading avatars:", error);
    return [];
  }

  return data || [];
}

export default async function CreateVideoPage({
  searchParams,
}: {
  searchParams: Promise<{ avatar?: string }>;
}) {
  const avatars = await getAvatars();
  const params = await searchParams;

  if (avatars.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No avatars available</p>
      </div>
    );
  }

  const selectedAvatarId =
    params.avatar && avatars.find((a) => a.id === params.avatar)
      ? params.avatar
      : avatars[0].id;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <CreateVideoClient
        avatars={avatars}
        initialSelectedAvatar={selectedAvatarId}
      />
    </Suspense>
  );
}
