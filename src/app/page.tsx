"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ModeSelector from "@/components/ui/ModeSelector";
import PromptInput from "@/components/ui/PromptInput";
import ImageUpload from "@/components/ui/ImageUpload";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { GenerationMode, VideoGenerationResponse } from "@/types/video";

export default function Home() {
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<GenerationMode>("text-to-video");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication check
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-violet-400 mb-4">Veo3 AI</h1>
          <p className="text-zinc-400 mb-6">Please login to continue</p>
          
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
          <span className="font-bold text-lg