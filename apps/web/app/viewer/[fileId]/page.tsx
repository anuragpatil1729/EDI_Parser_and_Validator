"use client";

import { useEffect } from "react";
import { useParse } from "@/hooks/useParse";
import ErrorTable from "@/components/errors/ErrorTable";
import SegmentTree from "@/components/tree/SegmentTree";
import AIChatPanel from "@/components/chat/AIChatPanel";

export default function ViewerPage({ params }: { params: { fileId: string } }) {
  const { parseResult, validation, loading, error, parseAndValidateByFileId } = useParse();

  useEffect(() => {
    parseAndValidateByFileId(params.fileId);
  }, [params.fileId, parseAndValidateByFileId]);

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-8 lg:grid-cols-3">
      <section className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-semibold">Viewer</h2>
        {loading ? <p>Processing...</p> : null}
        {error ? <p className="text-red-600">{error}</p> : null}
        {parseResult ? <SegmentTree tree={parseResult.loops} issues={validation?.issues || []} /> : null}
        {validation ? <ErrorTable issues={validation.issues} /> : null}
      </section>
      <aside>
        {parseResult && validation ? (
          <AIChatPanel transactionType={parseResult.transaction_type} issues={validation.issues} />
        ) : null}
      </aside>
    </main>
  );
}
