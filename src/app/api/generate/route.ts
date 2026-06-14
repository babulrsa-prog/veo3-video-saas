import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { VideoGenerationRequest, VideoGenerationResponse } from "@/types/video";
import { deductCredit, getCredits, hasCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
  try {
    // 1. Check if user is logged in
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json<VideoGenerationResponse>(
        { success: false, error: "Please login to generate videos." },
        { status: 401 }
      );
    }

    const userId = session.user.email;

    // 2. Check credits
    if (!hasCredits(userId)) {
      return NextResponse.json<VideoGenerationResponse>(
        { success: false, error: "No credits remaining. Please upgrade." },
        { status: 403 }
      );
    }

    // 3. Parse request
    const body: VideoGenerationRequest = await req.json();
    const { mode, prompt, imageUrl } = body;

    // 4. Validate
    if (!prompt || prompt.trim() === "") {
      return NextResponse.json<VideoGenerationResponse>(
        { success: false, error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (mode === "image-to-video" && !imageUrl) {
      return NextResponse.json<VideoGenerationResponse>(
        { success: false, error: "Image URL is required for image-to-video." },
        { status: 400 }
      );
    }

    // 5. Deduct credit
    deductCredit(userId);
    const remainingCredits = getCredits(userId);

    console.log(`[generate] user=${userId} credits=${remainingCredits} mode=${mode}`);

    // 6. TODO: Real Veo 3 API call goes here
    const mockJobId = `job_${Date.now()}`;

    return NextResponse.json<VideoGenerationResponse>({
      success: true,