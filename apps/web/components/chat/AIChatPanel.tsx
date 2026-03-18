"use client";

import { FormEvent, useState } from "react";
import { ValidationIssue } from "@/types/edi";
import { useChat } from "@/hooks/useChat";

export default function AIChatPanel({ transactionType, issues }: { transactionType: string; issues: ValidationIssue[] }) {
  const [question, setQuestion] = useState("Explain the top error and how to fix it.");
  const { response, loading, ask } = useChat();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issue = issues[0];
    await ask(question, transactionType, issue?.segment ?? "UNKNOWN", issue?.message ?? "No validation issues.");
  }

  return (
    <section className="rounded border bg-white p-4">
      <h3 className="mb-3 font-semibold">AI Assistant</h3>
      <form onSubmit={onSubmit} className="space-y-2">
        <textarea className="w-full rounded border p-2 text-sm" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <button type="submit" disabled={loading} className="rounded bg-primary px-3 py-2 text-white disabled:opacity-50">
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {response ? (
        <div className="mt-4 space-y-2 text-sm">
          <p>{response.explanation}</p>
          <p className="font-medium">Suggested fix: {response.suggested_fix}</p>
        </div>
      ) : null}
    </section>
  );
}
