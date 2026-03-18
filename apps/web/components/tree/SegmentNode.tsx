import { ValidationIssue } from "@/types/edi";

export default function SegmentNode({
  name,
  depth,
  hasError = false,
  issues = [],
}: {
  name: string;
  depth: number;
  hasError?: boolean;
  issues?: ValidationIssue[];
}) {
  return (
    <div style={{ paddingLeft: `${depth * 14}px` }} className="py-1 text-sm">
      <div className="flex items-center gap-2">
        <span>• {name}</span>
        {hasError ? <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Has errors</span> : null}
      </div>
      {issues.length > 0 ? (
        <ul className="mt-1 space-y-1 text-xs text-red-700">
          {issues.map((issue, index) => (
            <li key={`${issue.code}-${index}`}>{issue.error || issue.message}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
