"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/upload/Dropzone";
import { useUpload } from "@/hooks/useUpload";

export default function UploadPage() {
  const router = useRouter();
  const { upload, loading, error } = useUpload();

  useEffect(() => {
    if (!document.cookie.includes("sb-access-token=")) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-10">
      <h2 className="text-2xl font-semibold">Upload EDI file</h2>
      <Dropzone
        onFile={async (file) => {
          const uploaded = await upload(file);
          router.push(`/viewer/${uploaded.fileId}`);
        }}
      />
      {loading ? <p className="animate-pulse">Uploading file...</p> : null}
      {error ? <p className="rounded bg-red-50 px-3 py-2 text-red-700">Unable to upload this file right now.</p> : null}
    </main>
  );
}
