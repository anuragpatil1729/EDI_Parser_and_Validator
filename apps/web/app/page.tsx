import Link from "next/link";
import { Bot, CheckCircle2, FileSearch, ScanLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const features = [
  {
    title: "Parse",
    description: "Convert raw X12 data into readable loops, segments, and elements instantly.",
    icon: FileSearch,
  },
  {
    title: "Validate",
    description: "Run transaction-aware checks across 837, 835, and 834 files in real time.",
    icon: CheckCircle2,
  },
  {
    title: "AI Explain",
    description: "Get clear explanations and practical fixes for complex validation issues.",
    icon: Bot,
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 px-6 py-14 text-white shadow-xl md:px-10">
        <div className="max-w-3xl space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
            <ScanLine className="h-3.5 w-3.5" />
            Healthcare EDI Intelligence
          </p>
          <h2 className="text-3xl font-bold leading-tight md:text-5xl">Validate Healthcare EDI Files Instantly</h2>
          <p className="text-base text-indigo-100 md:text-lg">
            Parse, validate, and troubleshoot X12 transactions with AI-powered guidance designed for healthcare operations teams.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/upload"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Upload File
            </Link>
            <Link
              href="/dashboard/835"
              className="rounded-xl border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardContent className="space-y-3 p-6">
                <div className="inline-flex rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <p className="rounded-xl bg-slate-50 p-3 text-center text-sm font-medium text-slate-700">4 Transaction Types</p>
        <p className="rounded-xl bg-slate-50 p-3 text-center text-sm font-medium text-slate-700">Real-time Validation</p>
        <p className="rounded-xl bg-slate-50 p-3 text-center text-sm font-medium text-slate-700">AI-Powered Fixes</p>
      </section>
    </main>
  );
}
