import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus } from "lucide-react";
import { adminListCategories, adminListServices, adminSaveService, type AdminServiceDto } from "@/lib/booking/admin.functions";
import { adminToken } from "./admin-session";

type Draft = {
  id: string | null;
  name: string;
  description: string;
  duration_minutes: number;
  price_pounds: string;
  category_id: string;
  featured: boolean;
  active: boolean;
};

const blank: Draft = {
  id: null,
  name: "",
  description: "",
  duration_minutes: 30,
  price_pounds: "0",
  category_id: "",
  featured: false,
  active: true,
};

function toDraft(s: AdminServiceDto): Draft {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? "",
    duration_minutes: s.duration_minutes,
    price_pounds: (s.price_pence / 100).toFixed(2),
    category_id: s.category_id ?? "",
    featured: s.featured,
    active: s.active,
  };
}

export function ServicesManager() {
  const listFn = useServerFn(adminListServices);
  const catsFn = useServerFn(adminListCategories);
  const saveFn = useServerFn(adminSaveService);
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const servicesQ = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => listFn({ data: { accessToken: await adminToken() } }),
  });
  const catsQ = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => catsFn({ data: { accessToken: await adminToken() } }),
  });

  const save = useMutation({
    mutationFn: async (d: Draft) =>
      saveFn({
        data: {
          accessToken: await adminToken(),
          id: d.id,
          name: d.name.trim(),
          description: d.description.trim(),
          duration_minutes: Number(d.duration_minutes),
          price_pence: Math.round(parseFloat(d.price_pounds || "0") * 100),
          category_id: d.category_id || null,
          featured: d.featured,
          active: d.active,
        },
      }),
    onSuccess: () => {
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin-services"] });
    },
  });

  const rows = servicesQ.data ?? [];
  const cats = catsQ.data ?? [];
  const catName = (id: string | null) => cats.find((c) => c.id === id)?.name ?? "—";

  return (
    <section className="bg-card p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <h3 className="font-display text-lg text-charcoal">Treatment menu</h3>
        <button
          onClick={() => setDraft({ ...blank })}
          className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-ivory"
        >
          <Plus className="h-3.5 w-3.5" /> New treatment
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
            <span className="eyebrow">Name</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              required
              className="mt-2 w-full border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-charcoal"
            />
          </label>
          <label className="block">
            <span className="eyebrow">Category</span>
            <select
              value={draft.category_id}
              onChange={(e) => setDraft({ ...draft, category_id: e.target.value })}
              className="mt-2 w-full border border-border bg-card px-3 py-2.5 text-sm"
            >
              <option value="">Uncategorised</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="eyebrow">Description</span>
            <input
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="mt-2 w-full border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-charcoal"
            />
          </label>
          <label className="block">
            <span className="eyebrow">Duration (minutes)</span>
            <input
              type="number"
              min={15}
              max={300}
              step={15}
              value={draft.duration_minutes}
              onChange={(e) => setDraft({ ...draft, duration_minutes: Number(e.target.value) })}
              className="mt-2 w-full border border-border bg-card px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="eyebrow">Price (£)</span>
            <input
              type="number"
              min={0}
              step="0.50"
              value={draft.price_pounds}
              onChange={(e) => setDraft({ ...draft, price_pounds: e.target.value })}
              className="mt-2 w-full border border-border bg-card px-3 py-2.5 text-sm"
            />
          </label>
          <div className="flex items-center gap-6 md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
              Bookable online
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
              Highlight as signature
            </label>
          </div>
          {save.isError && <p className="text-sm text-destructive md:col-span-2">{(save.error as Error).message}</p>}
          <div className="flex justify-end gap-2 md:col-span-2">
            <button type="button" onClick={() => setDraft(null)} className="rounded-full border border-border px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-charcoal">
              Cancel
            </button>
            <button disabled={save.isPending} className="rounded-full bg-charcoal px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-ivory disabled:opacity-50">
              {save.isPending ? "Saving…" : "Save treatment"}
            </button>
          </div>
        </form>
      )}

      <div className="pt-5">
        {servicesQ.isLoading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading the menu…</div>
        ) : servicesQ.isError ? (
          <p className="py-6 text-sm text-destructive">{(servicesQ.error as Error).message}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <tr><th className="py-3">Treatment</th><th>Category</th><th>Duration</th><th>Price</th><th>Status</th><th></th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((s) => (
                  <tr key={s.id} className={s.active ? "" : "opacity-50"}>
                    <td className="py-3 text-charcoal">{s.name}</td>
                    <td className="text-muted-foreground">{catName(s.category_id)}</td>
                    <td className="text-muted-foreground">{s.duration_minutes} min</td>
                    <td className="font-display text-charcoal">£{(s.price_pence / 100).toFixed(2)}</td>
                    <td className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{s.active ? "Bookable" : "Hidden"}</td>
                    <td className="text-right">
                      <button onClick={() => setDraft(toDraft(s))} className="text-[11px] uppercase tracking-[0.2em] text-gold">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
