import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { services } from "@/lib/mock-data";
import { SALON_CONFIG } from "@/lib/salon-config";
import { useState } from "react";
import { Check } from "lucide-react";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: `Book Online — ${SALON_CONFIG.name} Barber & Salon, Ashford` },
      { name: "description", content: "Book a haircut, skin fade, beard trim, colour or beauty treatment at Lux & Glow in Ashford, TW15." },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/booking" }],
  }),
  component: BookingPage,
});

const barbers = ["Theo Marlowe", "Sebastian Ash", "Henry Caldwell"];
const times = ["09:00", "10:30", "11:45", "13:00", "14:30", "16:00", "17:15", "18:30"];

function BookingPage() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [barber, setBarber] = useState(barbers[0]);
  const [time, setTime] = useState(times[1]);
  const [done, setDone] = useState(false);
  const service = services.find((s) => s.id === serviceId)!;

  if (done) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-2xl px-5 py-32 text-center md:px-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold">
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-8 font-display text-4xl text-charcoal">Reservation confirmed.</h1>
          <p className="mt-4 text-muted-foreground">
            We've held <span className="text-charcoal">{service.name}</span> with {barber} at {time}.
            A discreet confirmation has been sent to your email.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link to="/dashboard" className="rounded-full bg-charcoal px-6 py-3 text-[12px] tracking-[0.2em] uppercase text-ivory">
              View Diary
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
        <h1 className="mt-3 font-display text-4xl text-charcoal md:text-6xl">Reserve your chair</h1>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div className="space-y-10 md:col-span-2">
            <Step n="01" label="Choose a service">
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setServiceId(s.id)}
                    className={`text-left border p-5 transition ${
                      serviceId === s.id ? "border-charcoal bg-cream" : "border-border hover:border-charcoal/50"
                    }`}
                  >
                    <p className="font-display text-lg text-charcoal">{s.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.duration} · £{s.price}</p>
                  </button>
                ))}
              </div>
            </Step>

            <Step n="02" label="Choose your master barber">
              <div className="flex flex-wrap gap-3">
                {barbers.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBarber(b)}
                    className={`rounded-full border px-5 py-2.5 text-sm ${
                      barber === b ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal hover:border-charcoal"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Step>

            <Step n="03" label="Select a time · Thu, 12 June">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {times.map((t) => (
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
            </Step>
          </div>

          <aside className="md:sticky md:top-28 self-start bg-cream p-7">
            <p className="eyebrow">Summary</p>
            <h3 className="mt-4 font-display text-2xl text-charcoal">{service.name}</h3>
            <ul className="mt-6 space-y-3 text-sm text-charcoal">
              <Row k="Duration" v={service.duration} />
              <Row k="Master barber" v={barber} />
              <Row k="Date" v="Thursday, 12 June" />
              <Row k="Time" v={time} />
              <Row k="House" v={SALON_CONFIG.name} />
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl text-charcoal">£{service.price}</span>
            </div>
            <button
              onClick={() => setDone(true)}
              className="mt-6 w-full rounded-full bg-charcoal py-4 text-[12px] tracking-[0.2em] uppercase text-ivory hover:opacity-90"
            >
              Confirm Reservation
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
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </li>
  );
}
