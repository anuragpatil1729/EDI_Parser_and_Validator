const members = [
  { memberId: "M0001", name: "Alicia Brown", plan: "PPO Gold", effectiveDate: "2026-01-01" },
  { memberId: "M0002", name: "Marcus Lee", plan: "HMO Silver", effectiveDate: "2026-02-15" },
];

export default function EnrollmentTable() {
  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-3 text-xl font-semibold">834 Enrollment</h2>
      <table className="min-w-full text-sm">
        <thead><tr><th className="text-left">Member</th><th className="text-left">Name</th><th className="text-left">Plan</th><th className="text-left">Effective</th></tr></thead>
        <tbody>{members.map((member) => <tr key={member.memberId}><td>{member.memberId}</td><td>{member.name}</td><td>{member.plan}</td><td>{member.effectiveDate}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
