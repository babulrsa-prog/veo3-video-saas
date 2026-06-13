interface VideoPlayerProps {
  videoUrl: string | null
  isLoading: boolean
}

export default function VideoPlayer({ videoUrl, isLoading }: VideoPlayerProps) {
  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Generating your video...</p>
      </div>
    )
  }

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-3">
        <p className="text-zinc-400 text-sm">Your generated video will appear here</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <video
        src={videoUrl}
        controls
        autoPlay
        className="w-full aspect-video bg-black rounded-xl border border-zinc-800"
      />
    </div>
  )
}