import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { adminListBookings, adminUpdateBookingStatus } from "@/lib/booking/admin.functions";
import { getBrowserSupabase } from "@/lib/supabase/browser";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isoDay(offset: number) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}
function prettyDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${DAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

async function token() {
  const supabase = await getBrowserSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? "";
}

const STATUS_ACTIONS: { label: string; value: "confirmed" | "completed" | "cancelled" | "no_show" }[] = [
  { label: "Confirm", value: "confirmed" },
  { label: "Complete", value: "completed" },
  { label: "No-show", value: "no_show" },
  { label: "Cancel", value: "cancelled" },
];

export function BookingDiary({ compact = false }: { compact?: boolean }) {
  const listFn = useServerFn(adminListBookings);
  const statusFn = useServerFn(adminUpdateBookingStatus);
  const qc = useQueryClient();

  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => isoDay(i)), []);
  const [date, setDate] = useState(dates[0]);

  const bookingsQ = useQuery({
    queryKey: ["admin-bookings", date],
    queryFn: async () => listFn({ data: { accessToken: await token(), from: date, to: date } }),
  });

  const setStatus = useMutation({
    mutationFn: async (v: { id: string; status: "confirmed" | "completed" | "cancelled" | "no_show" }) =>
      statusFn({ data: { accessToken: await token(), ...v } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });

  const rows = bookingsQ.data ?? [];

  return (
    <div>
      {!compact && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {dates.map((d) => {
            const dt = new Date(`${d}T00:00:00Z`);
            return (
              <button
                key={d}
                onClick={() => setDate(d)}
                className={`w-16 shrink-0 border py-3 text-center transition ${
                  date === d ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal hover:border-charcoal"
                }`}
              >
                <span className="block text-[11px] uppercase tracking-widest opacity-70">{DAYS[dt.getUTCDay()]}</span>
                <span className="mt-1 block font-display text-lg">{dt.getUTCDate()}</span>
              </button>
            );
          })}
        </div>
      )}

      {!compact && <p className="eyebrow mb-4">{prettyDate(date)} · {rows.length} booking{rows.length === 1 ? "" : "s"}</p>}

      {bookingsQ.isLoading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading the diary…
        </div>
      ) : bookingsQ.isError ? (
        <p className="py-6 text-sm text-destructive">{(bookingsQ.error as Error).message}</p>
      ) : rows.length === 0 ? (
        <p className="border border-dashed border-border p-6 text-sm text-muted-foreground">
          No bookings for {prettyDate(date)}.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="py-3">Time</th><th>Client</th><th>Service</th><th>Stylist</th><th>Status</th>
                {!compact && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(compact ? rows.slice(0, 5) : rows).map((b) => (
                <tr key={b.id}>
                  <td className="py-4 font-display text-charcoal">{b.scheduled_at.slice(11, 16)}</td>
                  <td className="text-charcoal">
                    {b.customer_name}
                    {b.customer_phone && <span className="block text-xs text-muted-foreground">{b.customer_phone}</span>}
                    {b.reference && <span className="block text-[11px] tracking-widest text-gold">{b.reference}</span>}
                  </td>
                  <td className="text-muted-foreground">{b.service_name}</td>
                  <td className="text-muted-foreground">{b.stylist_name}</td>
                  <td>
                    <span className="inline-flex rounded-full bg-cream px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-charcoal">
                      {b.status.replace("_", "-")}
                    </span>
                  </td>
                  {!compact && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {STATUS_ACTIONS.filter((a) => a.value !== b.status).map((a) => (
                          <button
                            key={a.value}
                            disabled={setStatus.isPending}
                            onClick={() => setStatus.mutate({ id: b.id, status: a.value })}
                            className="rounded-full border border-border px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-charcoal transition hover:border-charcoal disabled:opacity-40"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
