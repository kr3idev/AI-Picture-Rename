"use client";

import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import ImageTask from "@/type/ImageTask";

interface DropZoneProps {
  setImageTasks: React.Dispatch<React.SetStateAction<ImageTask[]>>;
}

export default function DropZone({ setImageTasks }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length == 0) return;

    toast.success("Import successful!");
    setImageTasks(
      Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => new ImageTask(f)),
    );
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="w-full h-full cursor-pointer">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-2xl cursor-pointer transition ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <p className="text-gray-500 text-center">
          ファイルをドラッグ＆ドロップ
          <br />
          またはクリックして選択
        </p>
      </div>
    </div>
  );
}
