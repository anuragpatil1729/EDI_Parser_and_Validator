import { useMemo, useState } from "react";
import SegmentNode from "./SegmentNode";
import { ValidationIssue } from "@/types/edi";

export type TreeNode = {
  loop: string;
  hl_id?: string;
  parent_id?: string;
  segments: Array<{ id: string; elements: string[]; index: number }>;
  children: TreeNode[];
};

function LoopCard({
  node,
  depth,
  errorSegments,
}: {
  node: TreeNode;
  depth: number;
  errorSegments: Set<string>;
}): JSX.Element {
  const [open, setOpen] = useState(true);
  const hasError = node.segments.some((segment) => errorSegments.has(segment.id));

  return (
    <div className={`rounded border p-3 ${hasError ? "border-red-300 bg-red-50" : "bg-white"}`}>
      <button className="flex w-full items-center justify-between text-left" onClick={() => setOpen((value) => !value)}>
        <SegmentNode name={`${node.loop}${node.hl_id ? ` (HL ${node.hl_id})` : ""}`} depth={depth} />
        <span className="text-xs text-slate-500">{open ? "Collapse" : "Expand"}</span>
      </button>

      {open ? (
        <>
          {node.segments.map((segment) => (
            <div
              key={`${segment.id}-${segment.index}`}
              style={{ paddingLeft: `${(depth + 1) * 14}px` }}
              className={`text-xs ${errorSegments.has(segment.id) ? "font-semibold text-red-700" : "text-slate-700"}`}
            >
              {segment.id}: {segment.elements.join("*")}
            </div>
          ))}
          <div className="mt-1 space-y-1">
            {node.children.map((child) => (
              <LoopCard key={`${child.loop}-${child.hl_id ?? "na"}`} node={child} depth={depth + 1} errorSegments={errorSegments} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function SegmentTree({ tree, issues = [] }: { tree: TreeNode; issues?: ValidationIssue[] }) {
  const errorSegments = useMemo(
    () =>
      new Set(
        issues
          .filter((issue) => issue.severity === "error" && issue.segment)
          .map((issue) => issue.segment as string),
      ),
    [issues],
  );

  return (
    <section className="space-y-2">
      <h3 className="text-lg font-semibold">Loop Tree</h3>
      <LoopCard node={tree} depth={0} errorSegments={errorSegments} />
    </section>
  );
}
