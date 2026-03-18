"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type MemberRecord = {
  member_id: string;
  name: string;
  status: "Accepted" | "Rejected" | "Pending";
  plan: string;
};

const members: MemberRecord[] = [
  { member_id: "M0001", name: "Alicia Brown", status: "Accepted", plan: "PPO Gold" },
  { member_id: "M0002", name: "Marcus Lee", status: "Rejected", plan: "HMO Silver" },
  { member_id: "M0003", name: "Lena Carter", status: "Pending", plan: "EPO Bronze" },
];

export default function EnrollmentTable() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => members.filter((member) => `${member.member_id} ${member.name} ${member.plan}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Members</p><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Active Plans</p><p className="text-2xl font-bold">12</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Pending Changes</p><p className="text-2xl font-bold">4</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>834 Member Enrollment</CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter members..." className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Member ID</th><th className="py-2">Name</th><th className="py-2">Status</th><th className="py-2">Plan</th></tr></thead>
            <tbody>
              {filtered.map((member, idx) => (
                <tr key={member.member_id} className={`transition-all duration-200 hover:bg-indigo-50 ${idx % 2 ? "bg-slate-50/60" : "bg-white"}`}>
                  <td className="py-2.5 font-medium">{member.member_id}</td><td className="py-2.5">{member.name}</td>
                  <td className="py-2.5"><Badge variant={member.status === "Accepted" ? "success" : member.status === "Rejected" ? "error" : "warning"}>{member.status}</Badge></td>
                  <td className="py-2.5">{member.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
}
