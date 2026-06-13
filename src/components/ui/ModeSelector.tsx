import { GenerationMode } from "@/types/video";

interface ModeSelectorProps {
  mode: GenerationMode;
  onChange: (mode: GenerationMode) => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1">
      <button
        onClick={() => onChange("text-to-video")}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          mode === "text-to-video"
            ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
        }`}
      >
        ✏️ Text to Video
      </button>
      <button
        onClick={() => onChange("image-to-video")}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          mode === "image-to-video"
            ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
        }`}
      >
        🖼️ Image to Video
      </button>
    </div>
  );
}