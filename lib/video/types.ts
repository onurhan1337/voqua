export type ValidVoice =
  | "Rachel"
  | "Domi"
  | "Bella"
  | "Antoni"
  | "Elli"
  | "Josh"
  | "Arnold"
  | "Adam"
  | "Sam";

export interface GenerateVideoRequest {
  avatar_id: string;
  script: string;
  voice: ValidVoice;
}

export interface FalWorkflowResult {
  video?: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
  output?: {
    video?: {
      url: string;
      content_type: string;
      file_name: string;
      file_size: number;
    };
  };
  error?: string;
  type?: string;
  message?: string;
  node_id?: string;
}

export interface VideoGenerationResponse {
  id: string;
  status: string;
  video_url?: string;
}

export interface VideoErrorResponse {
  error: string;
}

export interface Avatar {
  id: string;
  video_url: string;
}

export interface FalInputPayload {
  video_url: string;
  text: string;
  voice: string;
  speaker: string;
  prompt: Array<{
    text: string;
    speaker: string;
    voice: string;
  }>;
}
