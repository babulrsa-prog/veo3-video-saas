import { useRef } from "react";

interface ImageUploadProps {
  imageUrl: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ imageUrl, onChange, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    onChange(localUrl);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-zinc-400 mb-2">
        🖼️ Upload Image
      </label>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={`w-full border-2 border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition-all duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="max-h-48 rounded-lg object-contain"
          />
        ) : (
          <>
            <p className="text-4xl mb-2">📁</p>
            <p className="text-zinc-400 text-sm">Click to upload an image</p>
            <p className="text-zinc-600 text-xs mt-1">PNG, JPG, WEBP supported</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}