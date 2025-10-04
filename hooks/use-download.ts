import { useState } from "react";
import { downloadFile, generateVideoFilename } from "@/lib/utils/download";

export function useDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadVideo = async (videoId: string) => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const downloadUrl = `/api/video/${videoId}?download=true`;
      const filename = generateVideoFilename(videoId);
      await downloadFile(downloadUrl, filename);
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    } finally {
      setTimeout(() => setIsDownloading(false), 2000);
    }
  };

  return {
    isDownloading,
    downloadVideo,
  };
}
