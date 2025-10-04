export async function downloadFile(
  url: string,
  filename: string
): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}

export function generateVideoFilename(
  videoId: string,
  extension = "mp4"
): string {
  return `video-${videoId}.${extension}`;
}

export function generateFilename(
  prefix: string,
  id: string,
  extension: string
): string {
  return `${prefix}-${id}.${extension}`;
}
