import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Trash2 } from "lucide-react";
import {
  adminAddClosure,
  adminDeleteClosure,
  adminGetHours,
  adminListClosures,
  adminSaveHours,
} from "@/lib/booking/admin.functions";
import { adminToken, WEEKDAYS, hhmm } from "./admin-session";

export function HoursManager() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <OpeningHours />
      <Closures />
    </div>
  );
}

function OpeningHours() {
  const getFn = useServerFn(adminGetHours);
  const saveFn = useServerFn(adminSaveHours);
  const [days, setDays] = useState<{ weekday: number; open_time: string; close_time: string; is_closed: boolean }[]>([]);

  const q = useQuery({
    queryKey: ["admin-hours"],
    queryFn: async () => getFn({ data: { accessToken: await adminToken() } }),
  });

  useEffect(() => {
    if (!q.data) return;
    setDays(
      Array.from({ length: 7 }, (_, w) => {
        const f = q.data.find((d) => d.weekday === w);
        return {
          weekday: w,
          open_time: f ? hhmm(f.open_time) : "10:00",
          close_time: f ? hhmm(f.close_time) : "19:00",
          is_closed: f ? f.is_closed : true,
        };
      }),
    );
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => saveFn({ data: { accessToken: await adminToken(), days } }),
  });

  return (
    <section className="bg-card p-6 shadow-soft md:p-8">
      <h3 className="border-b border-border pb-4 font-display text-lg text-charcoal">Opening hours</h3>
      {q.isLoading || days.length === 0 ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : (
        <div className="space-y-2 pt-5">
          {days.map((d, i) => (
            <div key={d.weekday} className="grid grid-cols-[7rem_auto_auto_auto] items-center gap-3 text-sm">
              <span className="text-charcoal">{WEEKDAYS[d.weekday]}</span>
              <input type="time" value={d.open_time} disabled={d.is_closed}
                onChange={(e) => setDays(days.map((x, j) => (j === i ? { ...x, open_time: e.target.value } : x)))}
                className="border border-border bg-ivory px-2 py-1.5 disabled:opacity-40" />
              <input type="time" value={d.close_time} disabled={d.is_closed}
                onChange={(e) => setDays(days.map((x, j) => (j === i ? { ...x, close_time: e.target.value } : x)))}
                className="border border-border bg-ivory px-2 py-1.5 disabled:opacity-40" />
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" checked={d.is_closed}
                  onChange={(e) => setDays(days.map((x, j) => (j === i ? { ...x, is_closed: e.target.checked } : x)))} />
                Closed
              </label>
            </div>
          ))}
          {save.isError && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            {save.isSuccess && <span className="text-xs text-gold">Saved</span>}
            <button onClick={() => save.mutate()} disabled={save.isPending}
              className="rounded-full bg-charcoal px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-ivory disabled:opacity-50">
              {save.isPending ? "Saving…" : "Save hours"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Closures() {
  const listFn = useServerFn(adminListClosures);
  const addFn = useServerFn(adminAddClosure);
  const delFn = useServerFn(adminDeleteClosure);
  const qc = useQueryClient();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const q = useQuery({
    queryKey: ["admin-closures"],
    queryFn: async () => listFn({ data: { accessToken: await adminToken() } }),
  });

  const add = useMutation({
    mutationFn: async () => addFn({ data: { accessToken: await adminToken(), closed_on: date, reason } }),
    onSuccess: () => {
      setDate("");
      setReason("");
      qc.invalidateQueries({ queryKey: ["admin-closures"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => delFn({ data: { accessToken: await adminToken(), id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-closures"] }),
  });

  const rows = q.data ?? [];

  return (
    <section className="bg-card p-6 shadow-soft md:p-8">
      <h3 className="border-b border-border pb-4 font-display text-lg text-charcoal">Holidays & closures</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (date) add.mutate();
        }}
        className="grid gap-3 pt-5 sm:grid-cols-[auto_1fr_auto]"
      >
        <input type="date" value={date} required onChange={(e) => setDate(e.target.value)}
          className="border border-border bg-ivory px-3 py-2.5 text-sm" />
        <input value={reason} placeholder="Reason (optional)" onChange={(e) => setReason(e.target.value)}
          className="border border-border bg-ivory px-3 py-2.5 text-sm outline-none focus:border-charcoal" />
        <button disabled={add.isPending} className="rounded-full bg-charcoal px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-ivory disabled:opacity-50">
          {add.isPending ? "Adding…" : "Close this day"}
        </button>
      </form>
      {add.isError && <p className="mt-3 text-sm text-destructive">{(add.error as Error).message}</p>}

      <div className="pt-6">
        {q.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="border border-dashed border-border p-5 text-sm text-muted-foreground">No upcoming closures.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-display text-charcoal">
                    {new Date(`${c.closed_on}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                  </p>
                  {c.reason && <p className="text-xs text-muted-foreground">{c.reason}</p>}
                </div>
                <button onClick={() => remove.mutate(c.id)} disabled={remove.isPending}
                  className="text-muted-foreground transition hover:text-destructive" aria-label="Remove closure">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
