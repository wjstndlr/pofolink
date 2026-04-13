"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/image-compress";
import { usePortfolioStore } from "@/store/portfolioStore";

interface ImageUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  path?: string;
}

const ImageUploader = ({ currentUrl, onUpload, onRemove, path = "general" }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const portfolioId = usePortfolioStore((s) => s.portfolioId);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

      setUploading(true);
      try {
        const compressed = await compressImage(file);
        const formData = new FormData();
        formData.append("file", compressed);
        formData.append("portfolioId", portfolioId);
        formData.append("path", path);

        const res = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const { url } = await res.json();
          onUpload(url);
        }
      } finally {
        setUploading(false);
      }
    },
    [portfolioId, path, onUpload]
  );

  if (currentUrl) {
    return (
      <div className="relative group">
        <img
          src={currentUrl}
          alt="Uploaded"
          className="w-full aspect-[16/10] object-cover rounded-lg border"
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-border hover:border-accent/50 cursor-pointer transition-colors">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {uploading ? (
        <Loader2 className="w-5 h-5 text-accent animate-spin" />
      ) : (
        <>
          <Upload className="w-5 h-5 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground">이미지 업로드</span>
        </>
      )}
    </label>
  );
};

export default ImageUploader;
