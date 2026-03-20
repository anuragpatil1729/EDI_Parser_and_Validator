"use client";

import { useEffect, useState } from "react";

import { getDashboardData } from "@/lib/api";

type Claim = { claimId: string; patient: string; total: number; status: string };

export default function ClaimsTable() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getDashboardData("837")
      .then((data) => {
        if (!mounted) return;
        const parsed = data as { claims?: Claim[] };
        setClaims(parsed.claims || []);
      })
      .catch(() => mounted && setError("Unable to load claims right now."))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-3 text-xl font-semibold">837 Claims</h2>
      {loading ? <p className="animate-pulse text-sm text-slate-600">Loading claims...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!loading && !error && claims.length === 0 ? <p className="text-sm text-slate-500">No 837 claims found yet. Upload and parse an 837 file to populate this table.</p> : null}
      {!loading && !error && claims.length > 0 ? (
        <table className="min-w-full text-sm">
          <thead>
            <tr><th className="text-left">Claim</th><th className="text-left">Patient</th><th className="text-left">Amount</th><th className="text-left">Status</th></tr>
          </thead>
          <tbody>{claims.map((c) => <tr key={c.claimId}><td>{c.claimId}</td><td>{c.patient}</td><td>${c.total.toFixed(2)}</td><td>{c.status}</td></tr>)}</tbody>
        </table>
      ) : null}
    </section>
  );
}
