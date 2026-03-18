"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Menu, Upload, FileText, DollarSign, Users, ShieldCheck, X } from "lucide-react";
import { ComponentType, ReactNode, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: Route;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/837", label: "837 Claims", icon: FileText },
  { href: "/dashboard/835", label: "835 Remittance", icon: DollarSign },
  { href: "/dashboard/834", label: "834 Enrollment", icon: Users },
];

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/upload")) return "Upload EDI File";
  if (pathname.startsWith("/dashboard/837")) return "837 Claims Dashboard";
  if (pathname.startsWith("/dashboard/835")) return "835 Remittance Dashboard";
  if (pathname.startsWith("/dashboard/834")) return "834 Enrollment Dashboard";
  if (pathname.startsWith("/viewer/")) return "EDI Transaction Viewer";
  return "Healthcare EDI Validator";
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-slate-900 px-4 py-5 text-slate-100 shadow-xl transition-all duration-200",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="rounded-lg bg-indigo-500/20 p-2">
            <ShieldCheck className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <p className="text-sm font-semibold">Healthcare EDI</p>
            <p className="text-xs text-slate-400">Validator Suite</p>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-full px-3 py-2 text-sm transition-all duration-200",
                  active ? "bg-indigo-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-all duration-200 hover:bg-slate-100 md:hidden"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>
            </div>

            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Link>
          </div>
        </header>

        {open ? <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 md:hidden" /> : null}

        <div key={pathname} className="animate-page-fade p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
