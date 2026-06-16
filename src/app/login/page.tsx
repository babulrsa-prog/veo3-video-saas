"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ModeSelector from "@/components/ui/ModeSelector";
import PromptInput from "@/components/ui/PromptInput";
import ImageUpload from "@/components/ui/ImageUpload";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { GenerationMode, VideoGenerationResponse } from "@/types/video";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<GenerationMode>("text-to-video");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState(10);

  // Redirect to login if not authenticated
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Please login to continue</p>
          
            href="/login"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl"
          >
            Go to Login
          </a>
        </div>
      </main>
    );
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    if (mode === "image-to-video" && !imageUrl) {
      setError("Please upload an image.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt, imageUrl }),
      });

      const data: VideoGenerationResponse = await res.json();

      if (data.success && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setCredits((prev) => prev - 1);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="font-bold text-lg tracking-tight">Veo3 AI</span>
          <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full ml-1">BETA</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Credits Badge */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
            <span className="text-sm">🎫</span>
            <span className="text-sm font-medium text-violet-400">{credits} credits</span>
          </div>
          {/* User Info */}
          <div className="flex items-center gap-2">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="avatar"
                className="w-8 h-8 rounded-full border border-zinc-700"
              />
            )}
            <span className="text-sm text-zinc-400 hidden sm:block">
              {session?.user?.name}
            </span>
          </div>
          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs text-zinc-500 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            AI Video Generator
          </h1>
          <p className="mt-2 text-zinc-400">
            Transform your ideas into stunning videos using Google Veo 3
          </p>
        </div>

        {/* Mode Selector */}
        <ModeSelector mode={mode} onChange={setMode} />

        {/* Input Section */}
        <div className="flex flex-col gap-4">
          <PromptInput
            prompt={prompt}
            onChange={setPrompt}
            disabled={isLoading}
          />
          {mode === "image-to-video" && (
            <ImageUpload
              imageUrl={imageUrl}
              onChange={setImageUrl}
              disabled={isLoading}
            />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || credits === 0}
          className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl shadow-lg shadow-violet-500/20 transition-all duration-200"
        >
          {isLoading ? "Generating..." : credits === 0 ? "No Credits Left" : "Generate Video"}
        </button>

        {/* Video Player */}
        <VideoPlayer videoUrl={videoUrl} isLoading={isLoading} />
      </div>
    </main>
  );
}