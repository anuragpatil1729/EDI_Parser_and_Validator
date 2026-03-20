"use client";

import { useEffect, useState } from "react";

import { getDashboardData } from "@/lib/api";

type MemberRecord = { member_id: string; name: string; status: string; plan: string };

export default function EnrollmentTable() {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getDashboardData("834")
      .then((data) => {
        if (!mounted) return;
        const payload = data as { members?: MemberRecord[] };
        setMembers(payload.members || []);
      })
      .catch(() => mounted && setError("Unable to load enrollment records."))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-3 text-xl font-semibold">834 Member Enrollment</h2>
      {loading ? <p className="animate-pulse text-sm text-slate-600">Loading members...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!loading && !error && members.length === 0 ? <p className="text-sm text-slate-500">No 834 enrollment members found. Upload and parse an 834 file to see records.</p> : null}
      {!loading && !error && members.length > 0 ? (
        <table className="min-w-full text-sm"><thead><tr className="text-left"><th>Member ID</th><th>Name</th><th>Status</th><th>Plan</th></tr></thead><tbody>{members.map((member) => <tr key={member.member_id} className="border-t"><td>{member.member_id}</td><td>{member.name}</td><td>{member.status}</td><td>{member.plan}</td></tr>)}</tbody></table>
      ) : null}
    </section>
  );
}
