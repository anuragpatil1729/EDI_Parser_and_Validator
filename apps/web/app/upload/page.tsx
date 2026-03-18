"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/upload/Dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUpload } from "@/hooks/useUpload";

export default function UploadPage() {
  const router = useRouter();
  const { upload, loading, error } = useUpload();

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Upload and Validate EDI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dropzone
            onFile={async (file) => {
              const uploaded = await upload(file);
              router.push(`/viewer/${uploaded.fileId}`);
            }}
          />

          {loading ? (
            <div className="space-y-2 rounded-xl border border-indigo-200 bg-indigo-50 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading and processing your file...
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-indigo-100">
                <div className="h-full w-1/3 animate-progress rounded-full bg-indigo-600" />
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
