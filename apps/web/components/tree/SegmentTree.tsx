import { useMemo, useState } from "react";
import SegmentNode from "./SegmentNode";
import { LoopNode, ValidationIssue } from "@/types/edi";

function issueBelongsToSegment(issue: ValidationIssue, segmentId: string, loopId: string): boolean {
  if (issue.segment !== segmentId) {
    return false;
  }
  if (!issue.loop || issue.loop === "structural") {
    return true;
  }
  return issue.loop === loopId;
}

function LoopCard({
  node,
  depth,
  issues,
}: {
  node: LoopNode;
  depth: number;
  issues: ValidationIssue[];
}): JSX.Element {
  const [open, setOpen] = useState(true);

  const nodeIssues = issues.filter((issue) => issue.loop === node.loop);
  const hasSegmentErrors = node.segments.some((segment) => issues.some((issue) => issueBelongsToSegment(issue, segment.id, node.loop)));
  const hasError = hasSegmentErrors || nodeIssues.length > 0;

  return (
    <div className={`rounded border p-3 ${hasError ? "border-red-300 bg-red-50" : "bg-white"}`}>
      <button className="flex w-full items-center justify-between text-left" onClick={() => setOpen((value) => !value)}>
        <SegmentNode name={`${node.loop}${node.hl_id ? ` (HL ${node.hl_id})` : ""}`} depth={depth} hasError={hasError} issues={nodeIssues} />
        <span className="text-xs text-slate-500">{open ? "Collapse" : "Expand"}</span>
      </button>

      {open ? (
        <>
          {node.segments.map((segment) => {
            const segmentIssues = issues.filter((issue) => issueBelongsToSegment(issue, segment.id, node.loop));
            const segmentError = segmentIssues.some((issue) => issue.severity === "error");

            return (
              <div key={`${segment.id}-${segment.index}`} style={{ paddingLeft: `${(depth + 1) * 14}px` }} className="mb-1">
                <div className={`text-xs ${segmentError ? "font-semibold text-red-700" : "text-slate-700"}`}>
                  {segment.id}: {segment.elements.join("*")}
                </div>
                {segmentIssues.length > 0 ? (
                  <ul className="ml-3 mt-1 list-disc text-xs text-red-700">
                    {segmentIssues.map((issue, idx) => (
                      <li key={`${issue.code}-${idx}`}>
                        {issue.error || issue.message}
                        {issue.suggestion ? ` — ${issue.suggestion}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
          <div className="mt-1 space-y-1">
            {node.children.map((child) => (
              <LoopCard key={`${child.loop}-${child.hl_id ?? "na"}`} node={child} depth={depth + 1} issues={issues} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function SegmentTree({ loops, issues = [] }: { loops: LoopNode[]; issues?: ValidationIssue[] }) {
  const orderedLoops = useMemo(() => [...loops].sort((a, b) => Number(a.hl_id || 0) - Number(b.hl_id || 0)), [loops]);

  return (
    <section className="space-y-2">
      <h3 className="text-lg font-semibold">Loop Tree</h3>
      {orderedLoops.length === 0 ? <p className="text-sm text-slate-600">No HL loops found in this transaction.</p> : null}
      {orderedLoops.map((loop) => (
        <LoopCard key={`${loop.loop}-${loop.hl_id ?? "root"}`} node={loop} depth={0} issues={issues} />
      ))}
    </section>
  );
}
