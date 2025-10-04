import { createClient } from "@/lib/supabase/server";
import { FalWorkflowResult } from "./types";
import {
  LONG_SIGNED_URL_EXPIRY,
  VIDEO_CONTENT_TYPE,
  USER_VIDEOS_BUCKET,
} from "./constants";

export function extractVideoUrl(result: FalWorkflowResult): string {
  const videoUrl = result.video?.url || result.output?.video?.url;
  if (!videoUrl) {
    throw new Error(
      `No video URL found in workflow result. Available keys: ${Object.keys(
        result
      ).join(", ")}`
    );
  }
  return videoUrl;
}

export async function downloadVideo(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function uploadToStorage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  videoId: string,
  videoBuffer: Buffer
): Promise<string> {
  const fileName = `${userId}/${videoId}/video.mp4`;
  const { error: uploadError } = await supabase.storage
    .from(USER_VIDEOS_BUCKET)
    .upload(fileName, videoBuffer, {
      contentType: VIDEO_CONTENT_TYPE,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload video: ${uploadError.message}`);
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(USER_VIDEOS_BUCKET)
    .createSignedUrl(fileName, LONG_SIGNED_URL_EXPIRY);

  if (signedUrlError || !signedUrlData) {
    throw new Error("Failed to create signed URL for video");
  }

  return signedUrlData.signedUrl;
}

export async function updateVideoStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  videoId: string,
  status: string,
  additionalData?: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase
    .from("generated_videos")
    .update({ status, ...additionalData })
    .eq("id", videoId);

  if (error) {
    throw new Error(`Failed to update video status: ${error.message}`);
  }
}

export function cleanScript(script: string): string {
  return script
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateVideoUrl(url: string): boolean {
  return Boolean(url && url.startsWith("http"));
}
