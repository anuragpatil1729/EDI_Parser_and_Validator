"use client";

import { useRouter } from "next/navigation";

import { createClientComponentClient } from "@/lib/supabase/client";

export default function UserNav({ email }: { email?: string | null }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  if (!email) return <div className="ml-auto" />;

  return (
    <div className="ml-auto flex items-center gap-3">
      <span className="text-slate-600">{email}</span>
      <button
        type="button"
        className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
          router.refresh();
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
