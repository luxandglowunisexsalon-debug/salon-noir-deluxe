import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Admin-side booking management. The caller must pass their access token; we
// verify it server-side and check the user actually holds an admin role
// before touching anything with the service-role client.

async function requireAdmin(accessToken: string) {
  const { getSupabaseAdmin } = await import("@/lib/supabase/admin.server");
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) throw new Error("Not signed in.");
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
  const list = (roles ?? []).map((r: any) => r.role as string);
  if (!list.includes("admin") && !list.includes("super_admin")) throw new Error("Admins only.");
  return supabase;
}

export interface AdminBookingDto {
  id: string;
  reference: string | null;
  scheduled_at: string;
  duration_minutes: number;
  price_pence: number;
  status: string;
  notes: string | null;
  customer_name: string;
  customer_phone: string | null;
  service_name: string;
  stylist_name: string;
}

const listSchema = z.object({
  accessToken: z.string().min(10),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const adminListBookings = createServerFn({ method: "POST" })
  .inputValidator(listSchema)
  .handler(async ({ data }): Promise<AdminBookingDto[]> => {
    const supabase = await requireAdmin(data.accessToken);
    const { data: rows, error } = await supabase
      .from("bookings")
      .select(
        "id, reference, scheduled_at, duration_minutes, price_pence, status, notes, guest_name, guest_phone, customer_id, services(name), stylists(full_name)",
      )
      .gte("scheduled_at", `${data.from}T00:00:00+00:00`)
      .lte("scheduled_at", `${data.to}T23:59:59+00:00`)
      .order("scheduled_at");
    if (error) throw new Error(error.message);
    const customerIds = [...new Set((rows ?? []).map((b: any) => b.customer_id).filter(Boolean))] as string[];
    const profiles = new Map<string, { full_name: string | null; phone: string | null }>();
    if (customerIds.length) {
      const { data: profs } = await supabase.from("profiles").select("user_id, full_name, phone").in("user_id", customerIds);
      for (const p of profs ?? []) profiles.set(p.user_id as string, { full_name: p.full_name, phone: p.phone });
    }
    return (rows ?? []).map((b: any) => ({
      id: b.id,
      reference: b.reference,
      scheduled_at: b.scheduled_at,
      duration_minutes: b.duration_minutes,
      price_pence: b.price_pence,
      status: b.status,
      notes: b.notes,
      customer_name: b.guest_name ?? profiles.get(b.customer_id)?.full_name ?? "Client",
      customer_phone: b.guest_phone ?? profiles.get(b.customer_id)?.phone ?? null,
      service_name: b.services?.name ?? "Service",
      stylist_name: b.stylists?.full_name ?? "Team",
    }));
  });

const statusSchema = z.object({
  accessToken: z.string().min(10),
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
});

export const adminUpdateBookingStatus = createServerFn({ method: "POST" })
  .inputValidator(statusSchema)
  .handler(async ({ data }) => {
    const supabase = await requireAdmin(data.accessToken);
    const { error } = await supabase
      .from("bookings")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
