"use client";

import { useEffect, useMemo, useState } from "react";

import { getDashboardData } from "@/lib/api";

type RemitClaim = { claim_id: string; billed: number; paid: number; adjustments: number };

export default function RemittanceSummary() {
  const [claims, setClaims] = useState<RemitClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getDashboardData("835")
      .then((data) => {
        if (!mounted) return;
        const payload = data as { claims?: RemitClaim[] };
        setClaims(payload.claims || []);
      })
      .catch(() => mounted && setError("Unable to load remittance summary."))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(
    () => claims.reduce((acc, claim) => ({ billed: acc.billed + claim.billed, paid: acc.paid + claim.paid, adjustments: acc.adjustments + claim.adjustments }), { billed: 0, paid: 0, adjustments: 0 }),
    [claims],
  );

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-3 text-xl font-semibold">835 Remittance Summary</h2>
      {loading ? <p className="animate-pulse text-sm text-slate-600">Loading remittance data...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!loading && !error && claims.length === 0 ? <p className="text-sm text-slate-500">No 835 remittance data found. Upload and parse an 835 file to see summary totals.</p> : null}
      {!loading && !error && claims.length > 0 ? <>
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded bg-slate-50 p-3"><p className="text-sm text-slate-600">Total Billed</p><p className="text-lg font-semibold">${totals.billed.toFixed(2)}</p></div>
        <div className="rounded bg-slate-50 p-3"><p className="text-sm text-slate-600">Total Paid</p><p className="text-lg font-semibold">${totals.paid.toFixed(2)}</p></div>
        <div className="rounded bg-slate-50 p-3"><p className="text-sm text-slate-600">Adjustments</p><p className="text-lg font-semibold">${totals.adjustments.toFixed(2)}</p></div>
      </div>
      <table className="min-w-full text-sm"><thead><tr className="text-left"><th>Claim ID</th><th>Billed</th><th>Paid</th><th>Adjustments</th></tr></thead><tbody>{claims.map((claim) => <tr key={claim.claim_id} className="border-t"><td>{claim.claim_id}</td><td>${claim.billed.toFixed(2)}</td><td>${claim.paid.toFixed(2)}</td><td>${claim.adjustments.toFixed(2)}</td></tr>)}</tbody></table>
      </> : null}
    </section>
  );
}
