import { Segment } from "@/types/edi";

export default function EnrollmentTable({ segments }: { segments: Segment[] }) {
  const members = segments.filter((s) => s.id === "INS");
  return (
    <section>
      <h3>834 Enrollment</h3>
      <table>
        <thead><tr><th>#</th><th>Segment</th></tr></thead>
        <tbody>
          {members.map((m, i) => <tr key={m.index}><td>{i + 1}</td><td>{m.elements.join("*")}</td></tr>)}
        </tbody>
      </table>
    </section>
  );
}
