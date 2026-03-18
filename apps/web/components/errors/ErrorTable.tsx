import { ValidationIssue } from "@/types/edi";

export default function ErrorTable({ issues }: { issues: ValidationIssue[] }) {
  return (
    <section className="space-y-2">
      <h3 className="text-lg font-semibold">Validation Errors</h3>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">Severity</th>
              <th className="p-2">Loop</th>
              <th className="p-2">Segment</th>
              <th className="p-2">Element</th>
              <th className="p-2">Value</th>
              <th className="p-2">Error</th>
              <th className="p-2">Explanation</th>
              <th className="p-2">Suggestion</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => (
              <tr key={`${issue.code}-${index}`} className="border-t align-top">
                <td className={`p-2 font-medium ${issue.severity === "error" ? "text-red-700" : "text-amber-700"}`}>{issue.severity}</td>
                <td className="p-2">{issue.loop || "-"}</td>
                <td className="p-2">{issue.segment || "-"}</td>
                <td className="p-2">{issue.element || issue.element_position || "-"}</td>
                <td className="p-2">{issue.value || "-"}</td>
                <td className="p-2">{issue.error || issue.message}</td>
                <td className="p-2 text-slate-600">{issue.explanation || issue.message}</td>
                <td className="p-2 text-emerald-700">{issue.suggestion || issue.fix_suggestion || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
