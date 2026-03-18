import { ValidationIssue } from "@/types/edi";

export default function ErrorTable({ issues }: { issues: ValidationIssue[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Severity</th>
          <th>Code</th>
          <th>Message</th>
          <th>Location</th>
          <th>Fix</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue, i) => (
          <tr key={`${issue.code}-${i}`}>
            <td>{issue.severity}</td>
            <td>{issue.code}</td>
            <td>{issue.message}</td>
            <td>{issue.location || "-"}</td>
            <td>{issue.fix_suggestion || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
