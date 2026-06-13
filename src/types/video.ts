export type GenerationMode = "text-to-video" | "image-to-video";

export interface VideoGenerationRequest {
  mode: GenerationMode;
  prompt: string;
  imageUrl?: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  videoUrl?: string;
  jobId?: string;
  error?: string;
}

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface VideoJob {
  jobId: string;
  status: JobStatus;
  videoUrl?: string;
  prompt: string;
  mode: GenerationMode;
  createdAt: string;
}