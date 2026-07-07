import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let clientPromise: Promise<SupabaseClient> | null = null;

export function getBrowserSupabase(): Promise<SupabaseClient> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Supabase browser client requested on the server"));
  }
  if (!clientPromise) {
    clientPromise = fetch("/api/public/supabase-config")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load Supabase config");
        return r.json() as Promise<{ url: string; anonKey: string }>;
      })
      .then(({ url, anonKey }) =>
        createClient(url, anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: "hv-auth",
          },
        }),
      );
  }
  return clientPromise;
}
