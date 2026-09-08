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

// ---------- Salon management (services, team, hours, closures) ----------

const tokenOnly = z.object({ accessToken: z.string().min(10) });

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

export interface AdminServiceDto {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_pence: number;
  category_id: string | null;
  featured: boolean;
  active: boolean;
}

export const adminListCategories = createServerFn({ method: "POST" })
  .inputValidator(tokenOnly)
  .handler(async ({ data }): Promise<{ id: string; name: string }[]> => {
    const supabase = await requireAdmin(data.accessToken);
    const { data: rows, error } = await supabase.from("service_categories").select("id, name").order("sort_order");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminListServices = createServerFn({ method: "POST" })
  .inputValidator(tokenOnly)
  .handler(async ({ data }): Promise<AdminServiceDto[]> => {
    const supabase = await requireAdmin(data.accessToken);
    const { data: rows, error } = await supabase
      .from("services")
      .select("id, name, description, duration_minutes, price_pence, category_id, featured, active")
      .order("active", { ascending: false })
      .order("name");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const serviceSchema = z.object({
  accessToken: z.string().min(10),
  id: z.string().uuid().nullable().optional(),
  name: z.string().min(2).max(80),
  description: z.string().max(400).nullable().optional(),
  duration_minutes: z.number().int().min(15).max(300),
  price_pence: z.number().int().min(0).max(1000000),
  category_id: z.string().uuid().nullable().optional(),
  featured: z.boolean(),
  active: z.boolean(),
});

export const adminSaveService = createServerFn({ method: "POST" })
  .inputValidator(serviceSchema)
  .handler(async ({ data }) => {
    const supabase = await requireAdmin(data.accessToken);
    const payload = {
      name: data.name,
      description: data.description || null,
      duration_minutes: data.duration_minutes,
      price_pence: data.price_pence,
      category_id: data.category_id || null,
      featured: data.featured,
      active: data.active,
    };
    if (data.id) {
      const { error } = await supabase.from("services").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: created, error } = await supabase
      .from("services")
      .insert({ ...payload, slug: `${slugify(data.name)}-${Math.random().toString(36).slice(2, 6)}` })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    // New services are bookable with every active team member by default.
    const { data: stylists } = await supabase.from("stylists").select("id").eq("active", true);
    if (stylists?.length) {
      await supabase
        .from("stylist_services")
        .upsert(stylists.map((s: any) => ({ stylist_id: s.id, service_id: created.id })), {
          onConflict: "stylist_id,service_id",
        });
    }
    return { id: created.id as string };
  });

export interface AdminStylistDto {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  active: boolean;
}

export const adminListStylists = createServerFn({ method: "POST" })
  .inputValidator(tokenOnly)
  .handler(async ({ data }): Promise<AdminStylistDto[]> => {
    const supabase = await requireAdmin(data.accessToken);
    const { data: rows, error } = await supabase
      .from("stylists")
      .select("id, full_name, title, bio, active")
      .order("sort_order");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const stylistSchema = z.object({
  accessToken: z.string().min(10),
  id: z.string().uuid().nullable().optional(),
  full_name: z.string().min(2).max(80),
  title: z.string().max(80).nullable().optional(),
  bio: z.string().max(400).nullable().optional(),
  active: z.boolean(),
});

export const adminSaveStylist = createServerFn({ method: "POST" })
  .inputValidator(stylistSchema)
  .handler(async ({ data }) => {
    const supabase = await requireAdmin(data.accessToken);
    const payload = {
      full_name: data.full_name,
      title: data.title || null,
      bio: data.bio || null,
      active: data.active,
    };
    if (data.id) {
      const { error } = await supabase.from("stylists").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: created, error } = await supabase.from("stylists").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    // Give a new team member every active service and the salon's own hours.
    const [{ data: services }, { data: hours }] = await Promise.all([
      supabase.from("services").select("id").eq("active", true),
      supabase.from("salon_hours").select("weekday, open_time, close_time, is_closed"),
    ]);
    if (services?.length) {
      await supabase
        .from("stylist_services")
        .upsert(services.map((s: any) => ({ stylist_id: created.id, service_id: s.id })), {
          onConflict: "stylist_id,service_id",
        });
    }
    if (hours?.length) {
      await supabase.from("stylist_schedules").insert(
        hours.map((h: any) => ({
          stylist_id: created.id,
          weekday: h.weekday,
          start_time: h.open_time,
          end_time: h.close_time,
          is_off: h.is_closed,
        })),
      );
    }
    return { id: created.id as string };
  });

export const adminGetSchedules = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().min(10), stylistId: z.string().uuid() }))
  .handler(async ({ data }): Promise<{ weekday: number; start_time: string; end_time: string; is_off: boolean }[]> => {
    const supabase = await requireAdmin(data.accessToken);
    const { data: rows, error } = await supabase
      .from("stylist_schedules")
      .select("weekday, start_time, end_time, is_off")
      .eq("stylist_id", data.stylistId)
      .order("weekday");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const dayRow = z.object({
  weekday: z.number().int().min(0).max(6),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_off: z.boolean(),
});

export const adminSaveSchedules = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().min(10), stylistId: z.string().uuid(), days: z.array(dayRow).length(7) }))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin(data.accessToken);
    await supabase.from("stylist_schedules").delete().eq("stylist_id", data.stylistId);
    const { error } = await supabase.from("stylist_schedules").insert(
      data.days.map((d) => ({
        stylist_id: data.stylistId,
        weekday: d.weekday,
        start_time: `${d.start_time}:00`,
        end_time: `${d.end_time}:00`,
        is_off: d.is_off,
      })),
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminGetHours = createServerFn({ method: "POST" })
  .inputValidator(tokenOnly)
  .handler(async ({ data }): Promise<{ weekday: number; open_time: string; close_time: string; is_closed: boolean }[]> => {
    const supabase = await requireAdmin(data.accessToken);
    const { data: rows, error } = await supabase
      .from("salon_hours")
      .select("weekday, open_time, close_time, is_closed")
      .order("weekday");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSaveHours = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().min(10),
      days: z
        .array(
          z.object({
            weekday: z.number().int().min(0).max(6),
            open_time: z.string().regex(/^\d{2}:\d{2}$/),
            close_time: z.string().regex(/^\d{2}:\d{2}$/),
            is_closed: z.boolean(),
          }),
        )
        .length(7),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = await requireAdmin(data.accessToken);
    for (const d of data.days) {
      const { error } = await supabase
        .from("salon_hours")
        .upsert(
          { weekday: d.weekday, open_time: `${d.open_time}:00`, close_time: `${d.close_time}:00`, is_closed: d.is_closed },
          { onConflict: "weekday" },
        );
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminListClosures = createServerFn({ method: "POST" })
  .inputValidator(tokenOnly)
  .handler(async ({ data }): Promise<{ id: string; closed_on: string; reason: string | null }[]> => {
    const supabase = await requireAdmin(data.accessToken);
    const { data: rows, error } = await supabase
      .from("salon_closures")
      .select("id, closed_on, reason")
      .gte("closed_on", new Date().toISOString().slice(0, 10))
      .order("closed_on");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminAddClosure = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().min(10),
      closed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      reason: z.string().max(120).optional().or(z.literal("")),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = await requireAdmin(data.accessToken);
    const { error } = await supabase
      .from("salon_closures")
      .upsert({ closed_on: data.closed_on, reason: data.reason || null }, { onConflict: "closed_on" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteClosure = createServerFn({ method: "POST" })
  .inputValidator(z.object({ accessToken: z.string().min(10), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const supabase = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("salon_closures").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
