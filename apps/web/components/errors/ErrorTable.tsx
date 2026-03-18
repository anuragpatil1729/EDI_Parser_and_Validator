import { AlertCircle, AlertTriangle, CircleCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ValidationIssue } from "@/types/edi";

type ApplyFixPayload = { issue: ValidationIssue; nextValue: string };

function guessFixedValue(issue: ValidationIssue): string | null {
  const suggestion = issue.suggestion || issue.fix_suggestion || "";
  const quoted = suggestion.match(/"([^"]+)"/);
  if (quoted?.[1]) return quoted[1];
  const singleQuoted = suggestion.match(/'([^']+)'/);
  return singleQuoted?.[1] ?? null;
}

export default function ErrorTable({ issues, onApplyFix, fixingIssueKey, onSelectIssue }: { issues: ValidationIssue[]; onApplyFix?: (payload: ApplyFixPayload) => void; fixingIssueKey?: string | null; onSelectIssue?: (issue: ValidationIssue) => void; }) {
  if (issues.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Validation Errors</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"><CircleCheck className="h-5 w-5" /><p className="text-sm font-medium">Great news — no validation errors were found.</p></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Validation Errors</CardTitle></CardHeader>
      <CardContent className="max-h-[620px] overflow-y-auto p-0">
        <div className="space-y-3 p-4">
          {issues.map((issue, index) => {
            const issueKey = `${issue.code}-${index}`;
            const suggestedValue = guessFixedValue(issue);
            const isError = issue.severity === "error";
            return (
              <div key={issueKey} className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${isError ? "border-l-4 border-l-red-500" : "border-l-4 border-l-amber-500"}`}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <button type="button" className="text-left" onClick={() => onSelectIssue?.(issue)}>
                    <span className="font-semibold text-slate-900">{issue.segment || "Unknown"}.{issue.element || issue.element_position || "?"}</span>
                    <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">{issue.value ?? ""}</span>
                  </button>
                  <Badge variant={isError ? "error" : "warning"}>{issue.severity}</Badge>
                </div>

                <p className="flex items-start gap-2 text-sm text-slate-700"><AlertCircle className="mt-0.5 h-4 w-4 text-slate-400" />{issue.error || issue.message}</p>
                <p className="mt-1 text-sm text-slate-600">{issue.explanation || issue.message}</p>
                <p className="mt-1 flex items-start gap-2 text-sm text-emerald-700"><AlertTriangle className="mt-0.5 h-4 w-4" />{issue.suggestion || issue.fix_suggestion || "No suggestion provided."}</p>

                <div className="mt-3">
                  <button
                    type="button"
                    disabled={!suggestedValue || !onApplyFix || fixingIssueKey === issueKey}
                    onClick={() => {
                      if (!suggestedValue || !onApplyFix) return;
                      onApplyFix({ issue, nextValue: suggestedValue });
                    }}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {fixingIssueKey === issueKey ? "Applying..." : "Apply Fix"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
