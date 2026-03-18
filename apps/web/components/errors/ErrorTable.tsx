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
              <th className="p-2">Code</th>
              <th className="p-2">Loop</th>
              <th className="p-2">Segment</th>
              <th className="p-2">Element</th>
              <th className="p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => (
              <tr key={`${issue.code}-${index}`} className="border-t">
                <td className="p-2">{issue.severity}</td>
                <td className="p-2">{issue.code}</td>
                <td className="p-2">{issue.loop || "-"}</td>
                <td className="p-2">{issue.segment || "-"}</td>
                <td className="p-2">{issue.element_position ?? "-"}</td>
                <td className="p-2">{issue.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
