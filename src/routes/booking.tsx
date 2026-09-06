import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import { listServices, listStylists, getAvailability, createBooking } from "@/lib/booking/booking.functions";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: `Book Online — ${SALON_CONFIG.name} Barber & Salon, Ashford` },
      { name: "description", content: "Book a haircut, skin fade, beard trim, colour or beauty treatment at Lux & Glow in Ashford, TW15. Live availability, instant confirmation." },
      { property: "og:title", content: `Book Online — ${SALON_CONFIG.name}` },
      { property: "og:description", content: "Choose your service, stylist and time — live availability at Lux & Glow, Ashford." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/booking" }],
  }),
  component: BookingPage,
});

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
const money = (p: number) => `£${(p / 100).toFixed(p % 100 === 0 ? 0 : 2)}`;

function BookingPage() {
  const { session } = useAuth();
  const servicesFn = useServerFn(listServices);
  const stylistsFn = useServerFn(listStylists);
  const availabilityFn = useServerFn(getAvailability);
  const createFn = useServerFn(createBooking);

  const dates = useMemo(() => Array.from({ length: 28 }, (_, i) => isoDay(i)), []);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [stylistId, setStylistId] = useState<string | null>(null);
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const servicesQ = useQuery({ queryKey: ["services"], queryFn: () => servicesFn({}) });
  const stylistsQ = useQuery({ queryKey: ["stylists"], queryFn: () => stylistsFn({}) });

  const services = servicesQ.data ?? [];
  const service = services.find((s) => s.id === serviceId) ?? null;

  const availabilityQ = useQuery({
    queryKey: ["availability", date, serviceId, stylistId],
    enabled: !!serviceId,
    queryFn: () => availabilityFn({ data: { date, serviceId: serviceId!, stylistId } }),
  });

  const confirm = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          serviceId: serviceId!,
          stylistId,
          date,
          time: time!,
          customerId: session?.user.user_id ?? null,
          guest: {
            name: name || session?.profile.full_name || "",
            phone: phone || session?.profile.phone || "",
            email: email || session?.user.email || "",
            notes,
          },
        },
      }),
  });

  const contactName = name || session?.profile.full_name || "";
  const contactPhone = phone || session?.profile.phone || "";
  const canConfirm = !!service && !!time && contactName.trim().length > 1 && contactPhone.trim().length > 6;

  if (confirm.data) {
    const b = confirm.data;
    return (
      <SiteShell>
        <section className="mx-auto max-w-2xl px-5 py-28 text-center md:px-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold">
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-8 font-display text-4xl text-charcoal">Booking confirmed.</h1>
          <p className="mt-4 text-muted-foreground">
            <span className="text-charcoal">{b.serviceName}</span> with {b.stylistName} on{" "}
            {prettyDate(b.scheduledAt.slice(0, 10))} at {b.scheduledAt.slice(11, 16)}.
          </p>
          <p className="mt-4 inline-block rounded-full bg-cream px-5 py-2 font-display text-lg text-charcoal">
            Reference {b.reference}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Keep this reference — you'll need it (with your phone number) to change or cancel.
            {" "}Call us on {SALON_CONFIG.phone} for anything urgent.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link to="/dashboard" className="rounded-full bg-charcoal px-6 py-3 text-[12px] tracking-[0.2em] uppercase text-ivory">
              My Appointments
            </Link>
            <Link to="/" className="rounded-full border border-charcoal/30 px-6 py-3 text-[12px] tracking-[0.2em] uppercase text-charcoal">
              Return Home
            </Link>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-24 md:px-10 md:pt-24">
        <span className="eyebrow">Reserve</span>
        <h1 className="mt-3 font-display text-4xl text-charcoal md:text-6xl">Book your appointment</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Live availability at {SALON_CONFIG.name}, {SALON_CONFIG.seo.streetAddress}. No account needed.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div className="space-y-10 md:col-span-2">
            <Step n="01" label="Choose a service">
              {servicesQ.isLoading ? (
                <Skeleton rows={4} />
              ) : services.length === 0 ? (
                <Empty text="No services are published yet." />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setServiceId(s.id); setTime(null); }}
                      className={`border p-5 text-left transition ${
                        serviceId === s.id ? "border-charcoal bg-cream" : "border-border hover:border-charcoal/50"
                      }`}
                    >
                      <p className="font-display text-lg text-charcoal">{s.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {s.duration_minutes} min · {money(s.price_pence)}
                        {s.category ? ` · ${s.category}` : ""}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </Step>

            <Step n="02" label="Choose your stylist or barber">
              <div className="flex flex-wrap gap-3">
                <Pill active={stylistId === null} onClick={() => { setStylistId(null); setTime(null); }}>
                  Any available
                </Pill>
                {(stylistsQ.data ?? []).map((st) => (
                  <Pill key={st.id} active={stylistId === st.id} onClick={() => { setStylistId(st.id); setTime(null); }}>
                    {st.full_name}
                  </Pill>
                ))}
              </div>
            </Step>

            <Step n="03" label="Pick a date">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d) => {
                  const dt = new Date(`${d}T00:00:00Z`);
                  return (
                    <button
                      key={d}
                      onClick={() => { setDate(d); setTime(null); }}
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
            </Step>

            <Step n="04" label={`Select a time · ${prettyDate(date)}`}>
              {!serviceId ? (
                <Empty text="Choose a service first to see free times." />
              ) : availabilityQ.isFetching ? (
                <Skeleton rows={2} />
              ) : (availabilityQ.data?.slots.length ?? 0) === 0 ? (
                <Empty text="No free times on this day — please try another date or stylist." />
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {availabilityQ.data!.slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`border py-3 text-sm transition ${
                        time === t ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal hover:border-charcoal"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </Step>

            <Step n="05" label="Your details">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name" value={contactName} onChange={setName} placeholder="Jane Smith" />
                <Field label="Mobile number" value={contactPhone} onChange={setPhone} placeholder="07..." />
                <Field label="Email (optional)" value={email || session?.user.email || ""} onChange={setEmail} placeholder="you@email.com" />
                <Field label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Anything we should know" />
              </div>
            </Step>
          </div>

          <aside className="self-start bg-cream p-7 md:sticky md:top-28">
            <p className="eyebrow">Summary</p>
            <h3 className="mt-4 font-display text-2xl text-charcoal">{service?.name ?? "Select a service"}</h3>
            <ul className="mt-6 space-y-3 text-sm text-charcoal">
              <Row k="Duration" v={service ? `${service.duration_minutes} min` : "—"} />
              <Row k="Stylist" v={stylistId ? (stylistsQ.data ?? []).find((s) => s.id === stylistId)?.full_name ?? "—" : "Any available"} />
              <Row k="Date" v={prettyDate(date)} />
              <Row k="Time" v={time ?? "—"} />
              <Row k="Salon" v={SALON_CONFIG.name} />
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl text-charcoal">{service ? money(service.price_pence) : "—"}</span>
            </div>
            {confirm.isError && (
              <p className="mt-4 text-sm text-destructive">{(confirm.error as Error).message}</p>
            )}
            <button
              disabled={!canConfirm || confirm.isPending}
              onClick={() => confirm.mutate()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-4 text-[12px] tracking-[0.2em] uppercase text-ivory transition hover:opacity-90 disabled:opacity-40"
            >
              {confirm.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Booking
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">No charge today — settle in salon.</p>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function Step({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="font-display text-gold">{n}</span>
        <span className="eyebrow text-charcoal">{label}</span>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </li>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-2.5 text-sm transition ${
        active ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal hover:border-charcoal"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full border border-border bg-card px-4 py-3 text-sm text-charcoal outline-none focus:border-charcoal"
      />
    </label>
  );
}

function Skeleton({ rows }: { rows: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse bg-cream" />
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="border border-dashed border-border p-6 text-sm text-muted-foreground">{text}</p>;
}
