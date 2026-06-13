"use client";

import { useState } from "react";
import ModeSelector from "@/components/ui/ModeSelector";
import PromptInput from "@/components/ui/PromptInput";
import ImageUpload from "@/components/ui/ImageUpload";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { GenerationMode, VideoGenerationResponse } from "@/types/video";

export default function Home() {
  const [mode, setMode] = useState<GenerationMode>("text-to-video");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <span className="font-bold text-lg tracking-tight">Veo3 AI</span>
          <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full ml-1">BETA</span>
        </div>
        <p className="text-zinc-500 text-sm">Powered by Google Veo 3</p>
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
            ⚠️ {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl shadow-lg shadow-violet-500/20 transition-all duration-200"
        >
          {isLoading ? "⏳ Generating..." : "🎬 Generate Video"}
        </button>

        {/* Video Player */}
        <VideoPlayer videoUrl={videoUrl} isLoading={isLoading} />
      </div>
    </main>
  );
}