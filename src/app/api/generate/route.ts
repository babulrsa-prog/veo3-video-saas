import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Replicate from "replicate";
import { VideoGenerationRequest, VideoGenerationResponse } from "@/types/video";
import { deductCredit, getCredits, hasCredits } from "@/lib/credits";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    const output = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: prompt,
          num_frames: 24,
          width: 1024,
          height: 576,
        },
      }
    );

    const videoUrl = Array.isArray(output) ? output[0] : output;

    deductCredit(userId);
    const remainingCredits = getCredits(userId);
    console.log(`[generate] user=${userId} credits=${remainingCredits}`);

    return NextResponse.json({
      success: true,
      jobId: `job_${Date.now()}`,
      videoUrl: videoUrl,
    });

  } catch (error) {
    console.error("[generate] error:", error);
    return NextResponse.json(
      { success: false, error: "Video generation failed. Please try again." },
      { status: 500 }
    );
  }
}