const summary = [
  { key: "Payments", value: "$10,230.13" },
  { key: "Adjustments", value: "$320.22" },
  { key: "Denied", value: "$110.00" },
];

export default function RemittanceSummary() {
  return (
    <section className="rounded border bg-white p-4">
      <h2 className="mb-3 text-xl font-semibold">835 Remittance Summary</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {summary.map((item) => (
          <div key={item.key} className="rounded bg-slate-50 p-3">
            <p className="text-sm text-slate-600">{item.key}</p>
            <p className="text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
