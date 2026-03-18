import { ReactNode } from "react";

type BadgeVariant = "default" | "error" | "warning" | "success" | "muted";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "bg-indigo-100 text-indigo-700 border-indigo-200",
  error: "bg-red-100 text-red-700 border-red-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  muted: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Badge({ children, variant = "default", className = "" }: { children: ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
