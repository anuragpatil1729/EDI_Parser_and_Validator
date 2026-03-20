"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClientComponentClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (result.error) {
      setError("Unable to authenticate. Please check your credentials and try again.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input className="w-full rounded border border-slate-300 px-3 py-2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
        <input className="w-full rounded border border-slate-300 px-3 py-2" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {mode === "register" ? (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
          <input className="w-full rounded border border-slate-300 px-3 py-2" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
      ) : null}
      {error ? <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button className="w-full rounded bg-primary px-4 py-2 font-medium text-white disabled:opacity-50" disabled={loading} type="submit">
        {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Register"}
      </button>
      <p className="text-center text-sm text-slate-600">
        {mode === "login" ? "New here? " : "Already have an account? "}
        <Link className="font-semibold text-primary" href={mode === "login" ? "/register" : "/login"}>
          {mode === "login" ? "Create account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
