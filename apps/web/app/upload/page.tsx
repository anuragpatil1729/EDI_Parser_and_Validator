"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/upload/Dropzone";
import { useUpload } from "@/hooks/useUpload";

export default function UploadPage() {
  const router = useRouter();
  const { upload } = useUpload();
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    try {
      const result = await upload(file);
      const encoded = encodeURIComponent(result.content);
      router.push(`/viewer/local?raw=${encoded}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <main>
      <h2>Upload EDI</h2>
      <Dropzone onFile={onFile} />
      {error && <p>{error}</p>}
    </main>
  );
}
