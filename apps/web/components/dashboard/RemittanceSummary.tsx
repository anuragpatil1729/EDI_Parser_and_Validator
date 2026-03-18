import { Segment } from "@/types/edi";

export default function RemittanceSummary({ segments }: { segments: Segment[] }) {
  const payments = segments.filter((s) => s.id === "CLP").length;
  return (
    <section>
      <h3>835 Payment Summary</h3>
      <p>Total claim payment records: {payments}</p>
    </section>
  );
}
