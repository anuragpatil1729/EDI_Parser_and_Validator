"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/upload/Dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUpload } from "@/hooks/useUpload";

type SampleFile = {
  label: string;
  path: string;
  fileName: string;
  className: string;
};

const SAMPLE_FILES: SampleFile[] = [
  {
    label: "Valid 837",
    path: "/sample-files/valid_837.edi",
    fileName: "valid_837.edi",
    className: "border-indigo-300 text-indigo-700 hover:bg-indigo-50",
  },
  {
    label: "Invalid 837",
    path: "/sample-files/invalid_837.edi",
    fileName: "invalid_837.edi",
    className: "border-indigo-300 text-indigo-700 hover:bg-indigo-50",
  },
  {
    label: "Sample 835",
    path: "/sample-files/sample_835.edi",
    fileName: "sample_835.edi",
    className: "border-emerald-300 text-emerald-700 hover:bg-emerald-50",
  },
  {
    label: "Sample 834",
    path: "/sample-files/sample_834.edi",
    fileName: "sample_834.edi",
    className: "border-amber-300 text-amber-700 hover:bg-amber-50",
  },
];

export default function UploadPage() {
  const router = useRouter();
  const { upload, loading, error } = useUpload();

  const onUploadFile = async (file: File) => {
    const uploaded = await upload(file);
    router.push(`/viewer/${uploaded.fileId}`);
  };

  const onTrySampleFile = async (sample: SampleFile) => {
    const response = await fetch(sample.path);
    if (!response.ok) {
      throw new Error(`Failed to fetch sample file: ${sample.fileName}`);
    }

    const content = await response.text();
    const file = new File([content], sample.fileName, { type: "text/plain" });
    await onUploadFile(file);
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Upload and Validate EDI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dropzone onFile={onUploadFile} />

          <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Don&apos;t have a file? Try a sample:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_FILES.map((sample) => (
                <button
                  key={sample.fileName}
                  type="button"
                  disabled={loading}
                  onClick={() => onTrySampleFile(sample)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${sample.className}`}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </section>

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
