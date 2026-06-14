import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { VideoGenerationRequest, VideoGenerationResponse } from "@/types/video";
import { deductCredit, getCredits, hasCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: "Please login to generate videos." },
        { status: 401 }
      );
    }

    const userId = session.user.email;

    if (!hasCredits(userId)) {
      return NextResponse.json(
        { success: false, error: "No credits remaining." },
        { status: 403 }
      );
    }

    const body: VideoGenerationRequest = await req.json();
    const { mode, prompt, imageUrl } = body;

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (mode === "image-to-video" && !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Image URL is required." },
        { status: 400 }
      );
    }

    deductCredit(userId);
    const remainingCredits = getCredits(userId);
    console.log(`[generate] user=${userId} credits=${remainingCredits}`);

    return NextResponse.json({
      success: true,
      jobId: `job_${Date.now()}`,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    });

  } catch (error) {
    console.error("[generate] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}