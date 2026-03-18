"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useParse } from "@/hooks/useParse";
import ErrorTable from "@/components/errors/ErrorTable";
import SegmentTree from "@/components/tree/SegmentTree";
import AIChatPanel from "@/components/chat/AIChatPanel";

export default function ViewerPage() {
  const params = useSearchParams();
  const raw = params.get("raw") ? decodeURIComponent(String(params.get("raw"))) : "";
  const { parseResult, validation, parseAndValidate } = useParse();

  useEffect(() => {
    if (raw) {
      parseAndValidate(raw);
    }
  }, [raw]);

  return (
    <main>
      <h2>EDI Viewer</h2>
      {!parseResult && <p>Parsing...</p>}
      {parseResult && (
        <>
          <p>Transaction Type: {parseResult.transaction_type}</p>
          <SegmentTree tree={parseResult.loops as any} />
        </>
      )}
      {validation && <ErrorTable issues={validation.issues} />}
      {validation && parseResult && (
        <AIChatPanel
          transactionType={parseResult.transaction_type}
          issues={validation.issues}
        />
      )}
    </main>
  );
}
