import "../styles/globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata = {
  title: "Healthcare EDI Validator",
  description: "Upload, parse, validate, and explain X12 healthcare transactions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
