"use client";

import { ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const claims: { claimId: string; patient: string; payer: string; total: number; status: "Accepted" | "Rejected" | "Pending" }[] = [
  { claimId: "A10001", patient: "Jane Doe", payer: "United Health", total: 512.09, status: "Accepted" },
  { claimId: "A10002", patient: "John Smith", payer: "Aetna", total: 123.4, status: "Rejected" },
  { claimId: "A10003", patient: "Maria Jones", payer: "BCBS", total: 991.25, status: "Pending" },
];

const statusVariant = {
  Accepted: "success",
  Rejected: "error",
  Pending: "warning",
} as const;

export default function ClaimsTable() {
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    return claims
      .filter((claim) => `${claim.claimId} ${claim.patient} ${claim.payer}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sortAsc ? a.total - b.total : b.total - a.total));
  }, [query, sortAsc]);

  const total = filtered.reduce((acc, row) => acc + row.total, 0);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Claims</p><p className="text-2xl font-bold">{filtered.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Billed</p><p className="text-2xl font-bold">${total.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Acceptance Rate</p><p className="text-2xl font-bold">67%</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>837 Claims</CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search claims..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-2">Claim</th><th className="py-2">Patient</th><th className="py-2">Payer</th>
                <th className="py-2">
                  <button className="inline-flex items-center gap-1 transition-all duration-200 hover:text-slate-800" onClick={() => setSortAsc((v) => !v)}>
                    Amount <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => (
                <tr key={c.claimId} className={`transition-all duration-200 hover:bg-indigo-50 ${idx % 2 ? "bg-slate-50/60" : "bg-white"}`}>
                  <td className="px-1 py-2.5 font-medium">{c.claimId}</td><td className="px-1 py-2.5">{c.patient}</td><td className="px-1 py-2.5">{c.payer}</td><td className="px-1 py-2.5">${c.total.toFixed(2)}</td>
                  <td className="px-1 py-2.5"><Badge variant={statusVariant[c.status]}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
}
