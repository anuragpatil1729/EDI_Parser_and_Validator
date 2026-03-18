import { Segment } from "@/types/edi";

export default function ClaimsTable({ segments }: { segments: Segment[] }) {
  const claims = segments.filter((s) => s.id === "CLM");
  return (
    <section>
      <h3>837 Claims</h3>
      <table>
        <thead><tr><th>Claim #</th><th>Charge Amount</th></tr></thead>
        <tbody>
          {claims.map((clm) => (
            <tr key={clm.index}>
              <td>{clm.elements[0] || "-"}</td>
              <td>{clm.elements[1] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
