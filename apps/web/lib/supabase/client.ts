"use client";

type AuthResponse = {
  data: { session?: { access_token: string; user?: { email?: string | null } } | null; user?: { email?: string | null } | null };
  error: { message: string } | null;
};

type SupabaseLikeClient = {
  auth: {
    signInWithPassword: (params: { email: string; password: string }) => Promise<AuthResponse>;
    signUp: (params: { email: string; password: string }) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
  };
};

const storageKey = "sb-access-token";

async function authRequest(path: string, payload: Record<string, string>): Promise<AuthResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    return { data: {}, error: { message: "Supabase environment is not configured." } };
  }

  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    return { data: {}, error: { message: String(data.msg || data.error_description || data.error || "Authentication failed") } };
  }

  return { data: data as AuthResponse["data"], error: null };
}

export function createClientComponentClient(): SupabaseLikeClient {
  return {
    auth: {
      signInWithPassword: async ({ email, password }) => {
        const result = await authRequest("token?grant_type=password", { email, password });
        const token = result.data.session?.access_token || (result.data as { access_token?: string }).access_token;
        if (token) {
          localStorage.setItem(storageKey, token);
          document.cookie = `${storageKey}=${token}; path=/; max-age=3600; samesite=lax`;
        }
        return result;
      },
      signUp: async ({ email, password }) => {
        const result = await authRequest("signup", { email, password });
        const token = result.data.session?.access_token || (result.data as { access_token?: string }).access_token;
        if (token) {
          localStorage.setItem(storageKey, token);
          document.cookie = `${storageKey}=${token}; path=/; max-age=3600; samesite=lax`;
        }
        return result;
      },
      signOut: async () => {
        localStorage.removeItem(storageKey);
        document.cookie = `${storageKey}=; path=/; max-age=0; samesite=lax`;
      },
    },
  };
}
