"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";

type ImageUploadProps = {
  onImageSelect: (file: File) => void;
  preview?: string;
  onRemove?: () => void;
};

export default function ImageUpload({
  onImageSelect,
  preview,
  onRemove,
}: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxFiles: 1,
  });

  const handleRemove = () => {
    onRemove?.();
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-gray-200">
          <div className="relative w-full h-48">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
              title="Remove image"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-700">
          {isDragActive
            ? "Drop the image here..."
            : "Drag image here or click to select"}
        </p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF or WebP</p>
      </div>
    </div>
  );
}
