import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Booking server functions. All run with the service-role client so guests can
// book without an account while RLS stays locked down; every handler validates
// input and re-checks conflicts server-side.

const SLOT_MINUTES = 30;
const MIN_NOTICE_MINUTES = 120;
const MAX_ADVANCE_DAYS = 56;

export interface ServiceDto {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_pence: number;
  category: string | null;
  featured: boolean;
}

export interface StylistDto {
  id: string;
  full_name: string;
  title: string | null;
  active: boolean;
}

export const listServices = createServerFn({ method: "GET" }).handler(async (): Promise<ServiceDto[]> => {
  const { getSupabaseAdmin } = await import("@/lib/supabase/admin.server");
  const { data, error } = await getSupabaseAdmin()
    .from("services")
    .select("id, name, description, duration_minutes, price_pence, featured, service_categories(name)")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("price_pence");
  if (error) throw new Error(error.message);
  return (data ?? []).map((s: any) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    duration_minutes: s.duration_minutes,
    price_pence: s.price_pence,
    featured: s.featured,
    category: s.service_categories?.name ?? null,
  }));
});

export const listStylists = createServerFn({ method: "GET" }).handler(async (): Promise<StylistDto[]> => {
  const { getSupabaseAdmin } = await import("@/lib/supabase/admin.server");
  const { data, error } = await getSupabaseAdmin()
    .from("stylists")
    .select("id, full_name, title, active")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().uuid(),
  stylistId: z.string().uuid().nullable().optional(),
});

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function toHHMM(mins: number) {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

export const getAvailability = createServerFn({ method: "GET" })
  .inputValidator(availabilitySchema)
  .handler(async ({ data }): Promise<{ date: string; closed: boolean; slots: string[] }> => {
    const { getSupabaseAdmin } = await import("@/lib/supabase/admin.server");
    const supabase = getSupabaseAdmin();
    const date = data.date;
    const day = new Date(`${date}T00:00:00Z`);
    const weekday = day.getUTCDay();

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const maxStr = new Date(today.getTime() + MAX_ADVANCE_DAYS * 86400000).toISOString().slice(0, 10);
    if (date < todayStr || date > maxStr) return { date, closed: true, slots: [] };

    const [{ data: hours }, { data: closure }, { data: service }] = await Promise.all([
      supabase.from("salon_hours").select("*").eq("weekday", weekday).maybeSingle(),
      supabase.from("salon_closures").select("id").eq("closed_on", date).maybeSingle(),
      supabase.from("services").select("id, duration_minutes").eq("id", data.serviceId).eq("active", true).maybeSingle(),
    ]);
    if (!hours || hours.is_closed || closure || !service) return { date, closed: true, slots: [] };

    const duration = service.duration_minutes as number;

    // Eligible stylists: active, perform this service, working that weekday
    let skillQuery = supabase
      .from("stylist_services")
      .select("stylist_id, stylists!inner(id, active)")
      .eq("service_id", data.serviceId)
      .eq("stylists.active", true);
    if (data.stylistId) skillQuery = skillQuery.eq("stylist_id", data.stylistId);
    const { data: eligible } = await skillQuery;
    const stylistIds = [...new Set((eligible ?? []).map((e: any) => e.stylist_id as string))];
    if (stylistIds.length === 0) return { date, closed: true, slots: [] };

    const { data: schedules } = await supabase
      .from("stylist_schedules")
      .select("stylist_id, start_time, end_time")
      .in("stylist_id", stylistIds)
      .eq("weekday", weekday)
      .eq("is_off", false);

    const stylists = (schedules ?? []).map((s: any) => ({
      id: s.stylist_id as string,
      start: toMinutes(s.start_time),
      end: toMinutes(s.end_time),
    }));
    if (stylists.length === 0) return { date, closed: true, slots: [] };


    // Existing bookings that day for those stylists
    const dayStart = `${date}T00:00:00+00:00`;
    const dayEnd = `${date}T23:59:59+00:00`;
    const { data: bookings } = await supabase
      .from("bookings")
      .select("stylist_id, scheduled_at, duration_minutes")
      .in("stylist_id", stylists.map((s) => s.id))
      .gte("scheduled_at", dayStart)
      .lte("scheduled_at", dayEnd)
      .in("status", ["pending", "confirmed"]);

    const openMin = toMinutes(hours.open_time);
    const closeMin = toMinutes(hours.close_time);
    const now = new Date();
    const minNoticeMs = MIN_NOTICE_MINUTES * 60000;

    const free = new Set<string>();
    for (const st of stylists) {
      const start = Math.max(openMin, st.start);
      const end = Math.min(closeMin, st.end);
      const busy = (bookings ?? [])
        .filter((b: any) => b.stylist_id === st.id)
        .map((b: any) => {
          const d = new Date(b.scheduled_at);
          const m = d.getUTCHours() * 60 + d.getUTCMinutes();
          return { start: m, end: m + b.duration_minutes };
        });
      for (let m = start; m + duration <= end; m += SLOT_MINUTES) {
        if (busy.some((b) => m < b.end && m + duration > b.start)) continue;
        if (date === todayStr) {
          const slotUtc = new Date(`${date}T${toHHMM(m)}:00Z`);
          if (slotUtc.getTime() - now.getTime() < minNoticeMs) continue;
        }
        free.add(toHHMM(m));
      }
    }
    const slots = [...free].sort();
    return { date, closed: slots.length === 0, slots };
  });

const createSchema = z.object({
  serviceId: z.string().uuid(),
  stylistId: z.string().uuid().nullable().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  customerId: z.string().uuid().nullable().optional(),
  guest: z
    .object({
      name: z.string().min(2),
      phone: z.string().min(7),
      email: z.string().email().optional().or(z.literal("")),
      notes: z.string().max(500).optional().or(z.literal("")),
    })
    .nullable()
    .optional(),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator(createSchema)
  .handler(async ({ data }) => {
    const { getSupabaseAdmin } = await import("@/lib/supabase/admin.server");
    const supabase = getSupabaseAdmin();

    const { data: service } = await supabase
      .from("services")
      .select("id, name, duration_minutes, price_pence")
      .eq("id", data.serviceId)
      .eq("active", true)
      .maybeSingle();
    if (!service) throw new Error("That service is no longer available.");

    // Re-verify the slot is genuinely free right now
    const availability = await getAvailability({
      data: { date: data.date, serviceId: data.serviceId, stylistId: data.stylistId ?? null },
    });
    if (!availability.slots.includes(data.time)) {
      throw new Error("Sorry — that time has just been taken. Please pick another.");
    }

    let stylistId = data.stylistId ?? null;
    if (!stylistId) {
      // "Any stylist": pick one actually free at this slot
      const weekday = new Date(`${data.date}T00:00:00Z`).getUTCDay();
      const { data: eligible } = await supabase
        .from("stylist_services")
        .select("stylist_id, stylists!inner(active), stylist_schedules!inner(start_time, end_time, is_off, weekday)")
        .eq("service_id", data.serviceId)
        .eq("stylists.active", true)
        .eq("stylist_schedules.weekday", weekday)
        .eq("stylist_schedules.is_off", false);
      const slotMin = toMinutes(data.time);
      const candidates = (eligible ?? [])
        .filter((e: any) => toMinutes(e.stylist_schedules.start_time) <= slotMin && toMinutes(e.stylist_schedules.end_time) >= slotMin + service.duration_minutes)
        .map((e: any) => e.stylist_id as string);
      const { data: clashes } = await supabase
        .from("bookings")
        .select("stylist_id, scheduled_at, duration_minutes")
        .in("stylist_id", candidates.length ? candidates : ["00000000-0000-0000-0000-000000000000"])
        .gte("scheduled_at", `${data.date}T00:00:00+00:00`)
        .lte("scheduled_at", `${data.date}T23:59:59+00:00`)
        .in("status", ["pending", "confirmed"]);
      const freeStylist = candidates.find((id) =>
        !(clashes ?? []).some((b: any) => {
          if (b.stylist_id !== id) return false;
          const d = new Date(b.scheduled_at);
          const m = d.getUTCHours() * 60 + d.getUTCMinutes();
          return slotMin < m + b.duration_minutes && slotMin + service.duration_minutes > m;
        }),
      );
      if (!freeStylist) throw new Error("Sorry — that time has just been taken. Please pick another.");
      stylistId = freeStylist;
    }

    const insert: Record<string, unknown> = {
      service_id: data.serviceId,
      stylist_id: stylistId,
      scheduled_at: `${data.date}T${data.time}:00+00:00`,
      duration_minutes: service.duration_minutes,
      price_pence: service.price_pence,
      status: "confirmed",
      customer_id: data.customerId ?? null,
      guest_name: data.guest?.name ?? null,
      guest_email: data.guest?.email || null,
      guest_phone: data.guest?.phone ?? null,
      notes: data.guest?.notes || null,
    };

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert(insert)
      .select("id, reference, scheduled_at")
      .single();
    if (error) {
      if (error.message.includes("bookings_no_overlap")) {
        throw new Error("Sorry — that time has just been taken. Please pick another.");
      }
      throw new Error(error.message);
    }

    const { data: stylist } = await supabase.from("stylists").select("full_name").eq("id", stylistId).maybeSingle();
    return {
      id: booking.id,
      reference: booking.reference,
      scheduledAt: booking.scheduled_at,
      serviceName: service.name,
      stylistName: stylist?.full_name ?? "Lux & Glow Team",
      pricePence: service.price_pence,
      durationMinutes: service.duration_minutes,
    };
  });

const cancelSchema = z.object({
  reference: z.string().min(3),
  phoneOrEmail: z.string().min(3),
});

export const cancelBookingByReference = createServerFn({ method: "POST" })
  .inputValidator(cancelSchema)
  .handler(async ({ data }) => {
    const { getSupabaseAdmin } = await import("@/lib/supabase/admin.server");
    const supabase = getSupabaseAdmin();
    const { data: booking } = await supabase
      .from("bookings")
      .select("id, guest_email, guest_phone, scheduled_at, status")
      .eq("reference", data.reference.trim().toUpperCase())
      .maybeSingle();
    if (!booking) throw new Error("No booking found with that reference.");
    const idOk =
      booking.guest_phone === data.phoneOrEmail.trim() ||
      booking.guest_email?.toLowerCase() === data.phoneOrEmail.trim().toLowerCase();
    if (!idOk) throw new Error("The phone or email doesn't match this booking.");
    if (booking.status === "cancelled") return { ok: true };
    if (new Date(booking.scheduled_at).getTime() - Date.now() < 2 * 3600 * 1000) {
      throw new Error("This booking is within 2 hours — please call the salon to cancel.");
    }
    const { error } = await supabase.from("bookings").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", booking.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
