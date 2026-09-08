import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus } from "lucide-react";
import {
  adminGetSchedules,
  adminListStylists,
  adminSaveSchedules,
  adminSaveStylist,
  type AdminStylistDto,
} from "@/lib/booking/admin.functions";
import { adminToken, WEEKDAYS, hhmm } from "./admin-session";

type Draft = { id: string | null; full_name: string; title: string; bio: string; active: boolean };
const blank: Draft = { id: null, full_name: "", title: "", bio: "", active: true };

export function TeamManager() {
  const listFn = useServerFn(adminListStylists);
  const saveFn = useServerFn(adminSaveStylist);
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const teamQ = useQuery({
    queryKey: ["admin-stylists"],
    queryFn: async () => listFn({ data: { accessToken: await adminToken() } }),
  });

  const save = useMutation({
    mutationFn: async (d: Draft) =>
      saveFn({
        data: {
          accessToken: await adminToken(),
          id: d.id,
          full_name: d.full_name.trim(),
          title: d.title.trim(),
          bio: d.bio.trim(),
          active: d.active,
        },
      }),
    onSuccess: () => {
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin-stylists"] });
    },
  });

  const rows: AdminStylistDto[] = teamQ.data ?? [];

  return (
    <section className="bg-card p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <h3 className="font-display text-lg text-charcoal">The team</h3>
        <button
          onClick={() => setDraft({ ...blank })}
          className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-ivory"
        >
          <Plus className="h-3.5 w-3.5" /> Add team member
        </button>
      </div>

      {draft && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(draft);
          }}
          className="mt-6 grid gap-4 border border-champagne/60 bg-ivory p-5 md:grid-cols-2"
        >
          <label className="block">
            <span className="eyebrow">Full name</span>
            <input value={draft.full_name} required onChange={(e) => setDraft({ ...draft, full_name: e.target.value })}
              className="mt-2 w-full border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-charcoal" />
          </label>
          <label className="block">
            <span className="eyebrow">Job title</span>
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="mt-2 w-full border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-charcoal" />
          </label>
          <label className="block md:col-span-2">
            <span className="eyebrow">Short bio</span>
            <input value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              className="mt-2 w-full border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-charcoal" />
          </label>
          <label className="flex items-center gap-2 text-sm text-charcoal md:col-span-2">
            <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
            Taking bookings
          </label>
          {save.isError && <p className="text-sm text-destructive md:col-span-2">{(save.error as Error).message}</p>}
          <div className="flex justify-end gap-2 md:col-span-2">
            <button type="button" onClick={() => setDraft(null)} className="rounded-full border border-border px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-charcoal">Cancel</button>
            <button disabled={save.isPending} className="rounded-full bg-charcoal px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-ivory disabled:opacity-50">
              {save.isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      )}

      <div className="pt-5">
        {teamQ.isLoading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading the team…</div>
        ) : teamQ.isError ? (
          <p className="py-6 text-sm text-destructive">{(teamQ.error as Error).message}</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((s) => (
              <li key={s.id} className={`py-4 ${s.active ? "" : "opacity-50"}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-charcoal">{s.full_name}</p>
                    <p className="text-xs text-muted-foreground">{s.title || "Team member"} · {s.active ? "Taking bookings" : "Not bookable"}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setDraft({ id: s.id, full_name: s.full_name, title: s.title ?? "", bio: s.bio ?? "", active: s.active })}
                      className="text-[11px] uppercase tracking-[0.2em] text-gold">Edit</button>
                    <button onClick={() => setOpenId(openId === s.id ? null : s.id)}
                      className="text-[11px] uppercase tracking-[0.2em] text-charcoal">
                      {openId === s.id ? "Close hours" : "Working hours"}
                    </button>
                  </div>
                </div>
                {openId === s.id && <ScheduleEditor stylistId={s.id} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ScheduleEditor({ stylistId }: { stylistId: string }) {
  const getFn = useServerFn(adminGetSchedules);
  const saveFn = useServerFn(adminSaveSchedules);
  const [days, setDays] = useState<{ weekday: number; start_time: string; end_time: string; is_off: boolean }[]>([]);

  const q = useQuery({
    queryKey: ["admin-schedules", stylistId],
    queryFn: async () => getFn({ data: { accessToken: await adminToken(), stylistId } }),
  });

  useEffect(() => {
    if (!q.data) return;
    setDays(
      Array.from({ length: 7 }, (_, w) => {
        const found = q.data.find((d) => d.weekday === w);
        return {
          weekday: w,
          start_time: found ? hhmm(found.start_time) : "10:00",
          end_time: found ? hhmm(found.end_time) : "19:00",
          is_off: found ? found.is_off : true,
        };
      }),
    );
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => saveFn({ data: { accessToken: await adminToken(), stylistId, days } }),
  });

  if (q.isLoading || days.length === 0) {
    return <p className="mt-4 text-sm text-muted-foreground">Loading hours…</p>;
  }

  return (
    <div className="mt-4 border border-border bg-ivory p-5">
      <div className="space-y-2">
        {days.map((d, i) => (
          <div key={d.weekday} className="grid grid-cols-[7rem_auto_auto_auto] items-center gap-3 text-sm">
            <span className="text-charcoal">{WEEKDAYS[d.weekday]}</span>
            <input type="time" value={d.start_time} disabled={d.is_off}
              onChange={(e) => setDays(days.map((x, j) => (j === i ? { ...x, start_time: e.target.value } : x)))}
              className="border border-border bg-card px-2 py-1.5 disabled:opacity-40" />
            <input type="time" value={d.end_time} disabled={d.is_off}
              onChange={(e) => setDays(days.map((x, j) => (j === i ? { ...x, end_time: e.target.value } : x)))}
              className="border border-border bg-card px-2 py-1.5 disabled:opacity-40" />
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" checked={d.is_off}
                onChange={(e) => setDays(days.map((x, j) => (j === i ? { ...x, is_off: e.target.checked } : x)))} />
              Day off
            </label>
          </div>
        ))}
      </div>
      {save.isError && <p className="mt-3 text-sm text-destructive">{(save.error as Error).message}</p>}
      <div className="mt-4 flex items-center justify-end gap-3">
        {save.isSuccess && <span className="text-xs text-gold">Saved</span>}
        <button onClick={() => save.mutate()} disabled={save.isPending}
          className="rounded-full bg-charcoal px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-ivory disabled:opacity-50">
          {save.isPending ? "Saving…" : "Save hours"}
        </button>
      </div>
    </div>
  );
}
