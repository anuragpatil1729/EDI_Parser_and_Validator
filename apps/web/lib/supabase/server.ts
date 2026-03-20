import { cookies } from "next/headers";

export function createServerComponentClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    auth: {
      getUser: async () => {
        const token = cookies().get("sb-access-token")?.value;
        if (!token || !url || !anonKey) {
          return { data: { user: null }, error: { message: "No session" } };
        }

        const response = await fetch(`${url}/auth/v1/user`, {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          return { data: { user: null }, error: { message: "Session invalid" } };
        }

        const user = (await response.json()) as { email?: string; id?: string };
        return { data: { user }, error: null };
      },
    },
  };
}
