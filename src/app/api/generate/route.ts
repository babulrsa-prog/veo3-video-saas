import { NextRequest, NextResponse } from "next/server";
import { VideoGenerationRequest, VideoGenerationResponse } from "@/types/video";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the incoming request body
    const body: VideoGenerationRequest = await req.json();
    const { mode, prompt, imageUrl } = body;

    // 2. Basic validation
    if (!prompt || prompt.trim() === "") {
      return NextResponse.json<VideoGenerationResponse>(
        { success: false, error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (mode === "image-to-video" && !imageUrl) {
      return NextResponse.json<VideoGenerationResponse>(
        { success: false, error: "Image URL is required for image-to-video mode." },
        { status: 400 }
      );
    }

    // 3. TODO: Real Veo 3 API call will go here in a later step
    //    For now we return a mock response so the frontend can be built
    const mockJobId = `job_${Date.now()}`;

    console.log(`[generate] mode=${mode} prompt="${prompt}" jobId=${mockJobId}`);

    return NextResponse.json<VideoGenerationResponse>({
      success: true,
      jobId: mockJobId,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder video
    });

  } catch (error) {
    console.error("[generate] Unexpected error:", error);
    return NextResponse.json<VideoGenerationResponse>(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}