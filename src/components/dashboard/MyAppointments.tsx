import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Clock, Loader2, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { listMyBookings, cancelMyBooking } from "@/lib/booking/booking.functions";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { SALON_CONFIG } from "@/lib/salon-config";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function token() {
  const supabase = await getBrowserSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? "";
}

export function MyAppointments() {
  const listFn = useServerFn(listMyBookings);
  const cancelFn = useServerFn(cancelMyBooking);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => listFn({ data: { accessToken: await token() } }),
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => cancelFn({ data: { accessToken: await token(), id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-bookings"] }),
  });

  const now = Date.now();
  const upcoming = (q.data ?? [])
    .filter((b) => new Date(b.scheduled_at).getTime() >= now && b.status !== "cancelled")
    .reverse();

  if (q.isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your appointments…
      </div>
    );
  }
  if (q.isError)
    return <p className="py-6 text-sm text-destructive">{(q.error as Error).message}</p>;

  if (upcoming.length === 0) {
    return (
      <div className="border border-dashed border-border p-10 text-center">
        <p className="font-display text-2xl text-charcoal">No upcoming appointments</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Book your next visit and it will appear here.
        </p>
        <Link
          to="/booking"
          className="mt-6 inline-block rounded-full bg-charcoal px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ivory"
        >
          Book now
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {cancel.isError && (
        <p className="text-sm text-destructive">{(cancel.error as Error).message}</p>
      )}
      {upcoming.map((a) => {
        const d = new Date(a.scheduled_at);
        return (
          <article
            key={a.id}
            className="grid gap-6 bg-card p-6 shadow-soft transition hover:shadow-luxe md:grid-cols-12 md:p-8"
          >
            <div className="flex items-center gap-3 md:col-span-2 md:flex-col md:items-start md:gap-1 md:border-r md:border-border md:pr-6">
              <p className="font-display text-3xl text-gold">{d.getUTCDate()}</p>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {MONTHS[d.getUTCMonth()]}
                </p>
                <p className="text-xs text-muted-foreground">{DAYS[d.getUTCDay()]}</p>
              </div>
            </div>
            <div className="md:col-span-7">
              <span className="inline-flex rounded-full bg-cream px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-charcoal">
                {a.status.replace("_", "-")}
              </span>
              <h3 className="mt-3 font-display text-2xl text-charcoal">{a.service_name}</h3>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-charcoal/80">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gold" /> {a.scheduled_at.slice(11, 16)} ·{" "}
                  {a.duration_minutes} min
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-charcoal">
                  £{(a.price_pence / 100).toFixed(a.price_pence % 100 === 0 ? 0 : 2)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gold" /> {SALON_CONFIG.seo.streetAddress}
                </span>
              </div>
              {a.reference && (
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-gold">
                  Ref {a.reference}
                </p>
              )}
            </div>
            <div className="flex gap-2 md:col-span-3 md:flex-col md:justify-center">
              <Link
                to="/booking"
                className="rounded-full border border-border px-4 py-2 text-center text-[11px] uppercase tracking-[0.18em] text-charcoal hover:border-charcoal"
              >
                Rebook
              </Link>
              <button
                disabled={cancel.isPending}
                onClick={() => cancel.mutate(a.id)}
                className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-destructive disabled:opacity-40"
              >
                Cancel
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
