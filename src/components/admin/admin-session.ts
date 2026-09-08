import { getBrowserSupabase } from "@/lib/supabase/browser";

export async function adminToken() {
  const supabase = await getBrowserSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? "";
}

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function hhmm(t: string) {
  return t.slice(0, 5);
}
