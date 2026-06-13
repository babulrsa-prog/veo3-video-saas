interface PromptInputProps {
  prompt: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PromptInput({ prompt, onChange, disabled }: PromptInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-zinc-400 mb-2">
        ✏️ Describe your video
      </label>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="A cinematic shot of a futuristic city at night, neon lights reflecting on wet streets..."
        rows={4}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <p className="mt-1.5 text-xs text-zinc-600">
        {prompt.length}/500 characters
      </p>
    </div>
  );
}