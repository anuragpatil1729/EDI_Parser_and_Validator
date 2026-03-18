"use client";

import { useRef } from "react";

type Props = {
  onFile: (file: File) => void;
};

export default function Dropzone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="dropzone" onClick={() => inputRef.current?.click()}>
      <input
        ref={inputRef}
        type="file"
        accept=".edi,.txt,.x12"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      <p>Click to upload .edi / .txt / .x12 file</p>
    </div>
  );
}
