"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { ValidationIssue } from "@/types/edi";
import { useChat } from "@/hooks/useChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const LOOP_LABELS: Record<string, string> = { "20": "Billing Provider", "22": "Subscriber", "23": "Patient" };

function getLoopName(loop?: string): string {
  if (!loop) return "Unknown Loop";
  const suffix = loop.match(/(20|22|23)$/)?.[1];
  return suffix ? `${loop} (${LOOP_LABELS[suffix]})` : loop;
}

export default function AIChatPanel({ transactionType, issues, selectedIssue }: { transactionType: string; issues: ValidationIssue[]; selectedIssue?: ValidationIssue | null }) {
  const [question, setQuestion] = useState("Explain this issue and suggest a safe fix.");
  const { response, loading, ask } = useChat();
  const focusIssue = useMemo(() => selectedIssue ?? issues[0] ?? null, [issues, selectedIssue]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await ask(
      question,
      transactionType,
      focusIssue?.segment ?? "UNKNOWN",
      focusIssue?.error ?? focusIssue?.message ?? "No validation issues.",
      focusIssue?.value ?? "",
      { element: focusIssue?.element ?? String(focusIssue?.element_position ?? ""), loop_name: getLoopName(focusIssue?.loop) },
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {focusIssue ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={focusIssue.severity === "error" ? "error" : "warning"}>{focusIssue.severity}</Badge>
              <span className="font-semibold">{focusIssue.segment || "Unknown Segment"}</span>
              <span>{focusIssue.element || focusIssue.element_position || "?"}</span>
            </div>
            <p><span className="font-medium">Context:</span> <span className="font-mono">{focusIssue.value || ""}</span> • {getLoopName(focusIssue.loop)}</p>
          </div>
        ) : <p className="text-sm text-slate-500">Select an issue from the Tree or Errors tab to provide context.</p>}

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-indigo-600 px-3 py-2 text-sm text-white">{question}</div>
          </div>

          {loading ? (
            <div className="flex items-end gap-2">
              <div className="rounded-full bg-indigo-100 p-1.5 text-indigo-600"><Bot className="h-3.5 w-3.5" /></div>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:300ms]" />
              </div>
            </div>
          ) : null}

          {response ? (
            <div className="animate-page-fade flex items-start gap-2">
              <div className="rounded-full bg-indigo-100 p-1.5 text-indigo-600"><Bot className="h-3.5 w-3.5" /></div>
              <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
                <p><span className="font-semibold">Explanation:</span> {response.explanation}</p>
                <p className="mt-1"><span className="font-semibold">Fix:</span> {response.suggested_fix}</p>
              </div>
            </div>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
          <textarea className="min-h-[70px] flex-1 resize-none rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <button type="submit" disabled={loading || !focusIssue} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <Sparkles className="h-3.5 w-3.5" /> Ask
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
