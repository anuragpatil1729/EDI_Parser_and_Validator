"use client";

import { CloudUpload } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  onFile: (file: File) => void;
};

const acceptedFormats = [".edi", ".txt", ".dat", ".x12", ".zip"];

export default function Dropzone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={cn(
        "cursor-pointer rounded-2xl border-2 border-dashed bg-white p-10 text-center transition-all duration-200",
        isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-500",
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
          onFile(file);
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFile(file);
          }
        }}
      />

      <div className="mx-auto mb-4 inline-flex rounded-full bg-indigo-50 p-3 text-indigo-600">
        <CloudUpload className="h-6 w-6" />
      </div>
      <p className="text-base font-semibold text-slate-900">Drag & drop your EDI file here</p>
      <p className="mt-1 text-sm text-slate-500">or click to browse</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {acceptedFormats.map((format) => (
          <span key={format} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
            {format}
          </span>
        ))}
      </div>
    </div>
  );
}
