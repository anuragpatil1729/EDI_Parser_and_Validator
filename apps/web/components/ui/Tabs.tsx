"use client";

import { ReactNode } from "react";

export type TabItem<T extends string> = {
  key: T;
  label: string;
  count?: number;
};

export function Tabs<T extends string>({ items, active, onChange }: { items: TabItem<T>[]; active: T; onChange: (next: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            active === item.key ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
          type="button"
        >
          <span>{item.label}</span>
          {typeof item.count === "number" ? (
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${active === item.key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>{item.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
