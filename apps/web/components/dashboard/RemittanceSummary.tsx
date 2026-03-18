"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type RemitClaim = {
  claim_id: string;
  billed: number;
  paid: number;
  adjustments: number;
  status: "Accepted" | "Rejected" | "Pending";
};

const claims: RemitClaim[] = [
  { claim_id: "CLM1001", billed: 950, paid: 880, adjustments: 70, status: "Accepted" },
  { claim_id: "CLM1002", billed: 1200, paid: 990, adjustments: 210, status: "Pending" },
  { claim_id: "CLM1003", billed: 500, paid: 0, adjustments: 500, status: "Rejected" },
];

export default function RemittanceSummary() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => claims.filter((c) => c.claim_id.toLowerCase().includes(query.toLowerCase())), [query]);

  const totals = filtered.reduce((acc, claim) => {
    acc.billed += claim.billed;
    acc.paid += claim.paid;
    acc.adjustments += claim.adjustments;
    return acc;
  }, { billed: 0, paid: 0, adjustments: 0 });

  const max = Math.max(totals.billed, totals.paid, totals.adjustments, 1);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Billed</p><p className="text-2xl font-bold">${totals.billed.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Paid</p><p className="text-2xl font-bold">${totals.paid.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Adjustments</p><p className="text-2xl font-bold">${totals.adjustments.toFixed(2)}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Billed", value: totals.billed, color: "bg-indigo-500" },
            { label: "Paid", value: totals.paid, color: "bg-emerald-500" },
            { label: "Adjustments", value: totals.adjustments, color: "bg-amber-500" },
          ].map((row) => (
            <div key={row.label} className="space-y-1">
              <div className="flex justify-between text-sm"><span>{row.label}</span><span className="font-medium">${row.value.toFixed(2)}</span></div>
              <div className="h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${row.color}`} style={{ width: `${(row.value / max) * 100}%` }} /></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>835 Remittance Summary</CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search claim ID..." className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="py-2">Claim ID</th><th className="py-2">Billed</th><th className="py-2">Paid</th><th className="py-2">Adjustments</th><th className="py-2">Status</th></tr></thead>
            <tbody>{filtered.map((claim, idx) => <tr key={claim.claim_id} className={`transition-all duration-200 hover:bg-indigo-50 ${idx % 2 ? "bg-slate-50/60" : "bg-white"}`}><td className="py-2.5 font-medium">{claim.claim_id}</td><td className="py-2.5">${claim.billed.toFixed(2)}</td><td className="py-2.5">${claim.paid.toFixed(2)}</td><td className="py-2.5">${claim.adjustments.toFixed(2)}</td><td className="py-2.5"><Badge variant={claim.status === "Accepted" ? "success" : claim.status === "Rejected" ? "error" : "warning"}>{claim.status}</Badge></td></tr>)}</tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
}
