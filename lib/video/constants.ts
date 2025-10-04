import { ValidVoice } from "./types";

export const VALID_VOICES: readonly ValidVoice[] = [
  "Rachel",
  "Domi",
  "Bella",
  "Antoni",
  "Elli",
  "Josh",
  "Arnold",
  "Adam",
  "Sam",
] as const;

export const VOICE_ID_MAP: Record<ValidVoice, string> = {
  Rachel: "21m00Tcm4TlvDq8ikWAM",
  Domi: "AZnzlk1XvdvUeBnXmlld",
  Bella: "EXAVITQu4vr4xnSDxMaL",
  Antoni: "ErXwobaYiN019PkySvjV",
  Elli: "MF3mGyEYCl7XYWbV9V6O",
  Josh: "TxGEqnHWrfWFTfGW9XjX",
  Arnold: "VR6AewLTigWG4xSOukaG",
  Adam: "pNInz6obpgDQGcFmaJgB",
  Sam: "yoZ06aMxZJJ28mfd3POQ",
};

export const SIGNED_URL_EXPIRY = 60 * 60;
export const LONG_SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365;

export const VIDEO_CONTENT_TYPE = "video/mp4";
export const USER_VIDEOS_BUCKET = "user-videos";
