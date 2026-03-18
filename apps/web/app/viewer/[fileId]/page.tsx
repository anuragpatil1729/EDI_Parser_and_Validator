"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building2, CalendarDays, CheckCircle2, CircleX, ShieldAlert, UserRound } from "lucide-react";
import { useParse } from "@/hooks/useParse";
import ErrorTable from "@/components/errors/ErrorTable";
import SegmentTree from "@/components/tree/SegmentTree";
import AIChatPanel from "@/components/chat/AIChatPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TabPanel, Tabs } from "@/components/ui/Tabs";
import Badge from "@/components/ui/Badge";
import { validateEdi } from "@/lib/api";
import { LoopNode, ParseResult, Segment, ValidationIssue, ValidationResult } from "@/types/edi";

type ViewerTab = "tree" | "errors" | "ai";
type ClaimRow = { claimId: string; billed: string; paid: string; adjustment: string; status: string };
type MemberRow = { memberName: string; status: string; plan: string; effectiveDate: string };

function toElementIndex(issue: ValidationIssue): number | null { if (typeof issue.element_position === "number") return Math.max(0, issue.element_position - 1); if (issue.element && issue.segment && issue.element.startsWith(issue.segment)) { const suffix = issue.element.slice(issue.segment.length); const parsed = Number(suffix); if (Number.isFinite(parsed) && parsed > 0) return parsed - 1; } return null; }

function updateSegments(segments: Segment[], issue: ValidationIssue, nextValue: string): Segment[] {
  return segments.map((segment) => {
    if (segment.id !== issue.segment) return segment;
    if (issue.loop && issue.loop !== "structural" && segment.loop && segment.loop !== issue.loop) return segment;
    const nextElements = [...segment.elements];
    const indexToPatch = toElementIndex(issue) ?? nextElements.findIndex((value) => value === (issue.value ?? ""));
    if (indexToPatch < 0 || indexToPatch >= nextElements.length) return segment;
    nextElements[indexToPatch] = nextValue;
    return { ...segment, elements: nextElements };
  });
}

function updateLoopSegments(nodes: LoopNode[], issue: ValidationIssue, nextValue: string): LoopNode[] {
  return nodes.map((node) => ({ ...node, segments: updateSegments(node.segments, issue, nextValue), children: updateLoopSegments(node.children, issue, nextValue) }));
}

function build835Rows(segments: Segment[]): ClaimRow[] {
  const claims: ClaimRow[] = []; let current: ClaimRow | null = null;
  segments.forEach((segment) => { if (segment.id === "CLP") { if (current) claims.push(current); const billed = Number(segment.elements[2] ?? 0); const paid = Number(segment.elements[3] ?? 0); current = { claimId: segment.elements[0] || `Claim-${claims.length + 1}`, billed: billed ? billed.toFixed(2) : "0.00", paid: paid ? paid.toFixed(2) : "0.00", adjustment: (billed - paid).toFixed(2), status: segment.elements[1] || "Unknown" }; }});
  if (current) claims.push(current); return claims;
}

function build834Rows(segments: Segment[]): MemberRow[] {
  const members: MemberRow[] = []; let currentName = "Unknown";
  segments.forEach((segment) => { if (segment.id === "NM1") currentName = [segment.elements[2], segment.elements[1]].filter(Boolean).join(", ") || "Unknown Member"; if (segment.id === "INS") members.push({ memberName: currentName, status: segment.elements[0] === "Y" ? "Add" : "Terminate", plan: segment.elements[1] || "-", effectiveDate: "-" }); if (segment.id === "DTP" && members.length > 0) members[members.length - 1].effectiveDate = segment.elements[2] || members[members.length - 1].effectiveDate; });
  return members;
}

export default function ViewerPage({ params }: { params: { fileId: string } }) {
  const { parseResult, validation, loading, error, parseAndValidateByFileId } = useParse();
  const [workingParseResult, setWorkingParseResult] = useState<ParseResult | null>(null);
  const [workingValidation, setWorkingValidation] = useState<ValidationResult | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<ValidationIssue | null>(null);
  const [activeTab, setActiveTab] = useState<ViewerTab>("tree");
  const [fixingIssueKey, setFixingIssueKey] = useState<string | null>(null);

  useEffect(() => { parseAndValidateByFileId(params.fileId); }, [params.fileId, parseAndValidateByFileId]);
  useEffect(() => setWorkingParseResult(parseResult), [parseResult]);
  useEffect(() => setWorkingValidation(validation), [validation]);

  const onSelectIssue = useCallback((issue: ValidationIssue) => { setSelectedIssue(issue); setActiveTab("ai"); }, []);

  const onApplyFix = useCallback(async ({ issue, nextValue }: { issue: ValidationIssue; nextValue: string }) => {
    if (!workingParseResult) return;
    const fixKey = `${issue.code}-${issue.segment}-${issue.element || issue.element_position || "na"}`;
    setFixingIssueKey(fixKey);
    const updatedParseResult: ParseResult = { ...workingParseResult, segments: updateSegments(workingParseResult.segments, issue, nextValue), loops: updateLoopSegments(workingParseResult.loops, issue, nextValue) };
    setWorkingParseResult(updatedParseResult);
    try { const revalidated = await validateEdi(updatedParseResult.transaction_type, updatedParseResult.segments, params.fileId); setWorkingValidation(revalidated); }
    finally { setFixingIssueKey(null); }
  }, [params.fileId, workingParseResult]);

  const issues = workingValidation?.issues || [];
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;

  const claims835 = useMemo(() => (workingParseResult?.transaction_type === "835" ? build835Rows(workingParseResult.segments) : []), [workingParseResult]);
  const members834 = useMemo(() => (workingParseResult?.transaction_type === "834" ? build834Rows(workingParseResult.segments) : []), [workingParseResult]);

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
      <section className="space-y-4 lg:col-span-2">
        {loading ? (
          <Card><CardContent className="space-y-3 p-6"><div className="h-5 w-40 animate-pulse rounded bg-slate-200" /><div className="h-4 w-full animate-pulse rounded bg-slate-200" /><div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" /></CardContent></Card>
        ) : null}

        {error ? <Card><CardContent className="flex items-center gap-2 p-4 text-red-700"><CircleX className="h-4 w-4" />{error}</CardContent></Card> : null}

        {workingParseResult && workingValidation ? (
          <>
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <Badge>Type {workingParseResult.transaction_type}</Badge>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1"><Building2 className="h-3.5 w-3.5" />Sender: {workingParseResult.sender || "Unknown"}</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1"><UserRound className="h-3.5 w-3.5" />Receiver: {workingParseResult.receiver || "Unknown"}</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1"><CalendarDays className="h-3.5 w-3.5" />{workingParseResult.date || "Unknown date"}</span>
                  <Badge variant={workingValidation.is_valid ? "success" : "error"}>{workingValidation.is_valid ? "Valid" : "Invalid"}</Badge>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-sm">
                  <div className="inline-flex items-center gap-2 text-red-600"><ShieldAlert className="h-4 w-4" />{errorCount} errors</div>
                  <div className="inline-flex items-center gap-2 text-amber-600"><AlertTriangle className="h-4 w-4" />{warningCount} warnings</div>
                </div>
              </CardContent>
            </Card>

            <Tabs items={[{ key: "tree", label: "Tree" }, { key: "errors", label: "Errors", count: issues.length }, { key: "ai", label: "AI" }]} active={activeTab} onChange={setActiveTab} />

            {activeTab === "tree" ? <TabPanel><SegmentTree loops={workingParseResult.loops} issues={issues} onSelectIssue={onSelectIssue} /></TabPanel> : null}
            {activeTab === "errors" ? <TabPanel><ErrorTable issues={issues} onApplyFix={onApplyFix} fixingIssueKey={fixingIssueKey} onSelectIssue={onSelectIssue} /></TabPanel> : null}
            {activeTab === "ai" ? <TabPanel><AIChatPanel transactionType={workingParseResult.transaction_type} issues={issues} selectedIssue={selectedIssue} /></TabPanel> : null}
          </>
        ) : null}

        {workingParseResult?.transaction_type === "835" ? (
          <Card><CardHeader><CardTitle>835 Claims Snapshot</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="border-b text-left text-slate-500"><th className="py-2">Claim ID</th><th className="py-2">Billed</th><th className="py-2">Paid</th><th className="py-2">Adjustment</th><th className="py-2">Status</th></tr></thead><tbody>{claims835.map((row, idx) => <tr key={row.claimId} className={`transition-all duration-200 hover:bg-indigo-50 ${idx % 2 ? "bg-slate-50/60" : "bg-white"}`}><td className="py-2.5">{row.claimId}</td><td className="py-2.5">{row.billed}</td><td className="py-2.5">{row.paid}</td><td className="py-2.5">{row.adjustment}</td><td className="py-2.5">{row.status}</td></tr>)}</tbody></table></CardContent></Card>
        ) : null}

        {workingParseResult?.transaction_type === "834" ? (
          <Card><CardHeader><CardTitle>834 Enrollment Snapshot</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="border-b text-left text-slate-500"><th className="py-2">Member Name</th><th className="py-2">Status</th><th className="py-2">Plan</th><th className="py-2">Effective Date</th></tr></thead><tbody>{members834.map((row, idx) => <tr key={`${row.memberName}-${idx}`} className={`transition-all duration-200 hover:bg-indigo-50 ${idx % 2 ? "bg-slate-50/60" : "bg-white"}`}><td className="py-2.5">{row.memberName}</td><td className="py-2.5">{row.status}</td><td className="py-2.5">{row.plan}</td><td className="py-2.5">{row.effectiveDate}</td></tr>)}</tbody></table></CardContent></Card>
        ) : null}
      </section>

      <aside className="hidden lg:block">
        {workingParseResult && workingValidation ? (
          <div className="sticky top-24"><AIChatPanel transactionType={workingParseResult.transaction_type} issues={issues} selectedIssue={selectedIssue} /></div>
        ) : (
          <Card><CardContent className="p-6 text-center text-slate-500"><CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-slate-400" />AI insights will appear once a file is parsed.</CardContent></Card>
        )}
      </aside>
    </main>
  );
}
