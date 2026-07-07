import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!admin) {
    const url = process.env.APP_SUPABASE_URL;
    const serviceKey = process.env.APP_SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) throw new Error("Supabase admin env not configured");
    admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return admin;
}
