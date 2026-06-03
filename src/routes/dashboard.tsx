import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import {
  currentCustomer,
  upcomingAppointments,
  bookingHistory,
  customerNotifications,
  coupons,
  services,
} from "@/lib/mock-data";
import { Bell, Gift, Heart, Settings, Calendar, Award } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: `Members — ${SALON_CONFIG.name}` },
      { name: "description", content: "Your private diary, rewards and grooming history." },
    ],
  }),
  component: CustomerDashboard,
});

function CustomerDashboard() {
  const c = currentCustomer;
  const progress = Math.min(100, Math.round((c.points / (c.points + c.pointsToNext)) * 100));

  return (
    <SiteShell>
      <section className="border-b border-border bg-cream/60">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">The Vale Circle · {c.tier}</span>
              <h1 className="mt-3 font-display text-3xl text-charcoal md:text-5xl">Welcome, {c.name.split(" ")[0]}.</h1>
              <p className="mt-2 text-muted-foreground">Member since {c.joined} · {c.visits} visits</p>
            </div>
            <Link to="/booking" className="rounded-full bg-charcoal px-6 py-3 text-[12px] tracking-[0.2em] uppercase text-ivory">
              Book Next Chair
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <Stat icon={<Award className="h-4 w-4 text-gold" />} label="Loyalty points" value={c.points.toLocaleString()} sub={`${c.pointsToNext} to Vale tier`} progress={progress} />
          <Stat icon={<Calendar className="h-4 w-4 text-gold" />} label="Upcoming" value={`${upcomingAppointments.length}`} sub="appointments booked" />
          <Stat icon={<Gift className="h-4 w-4 text-gold" />} label="Active rewards" value={`${coupons.length}`} sub="vouchers ready to use" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Panel title="Upcoming appointments">
              <ul className="divide-y divide-border">
                {upcomingAppointments.map((a) => (
                  <li key={a.id} className="grid gap-2 py-5 md:grid-cols-12 md:items-center">
                    <div className="md:col-span-5">
                      <p className="font-display text-lg text-charcoal">{a.service}</p>
                      <p className="text-xs text-muted-foreground">with {a.barber}</p>
                    </div>
                    <p className="text-sm text-charcoal md:col-span-4">{a.date} · {a.time}</p>
                    <span className="md:col-span-2 inline-flex w-fit rounded-full bg-cream px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-charcoal">
                      {a.status}
                    </span>
                    <button className="text-[11px] tracking-[0.2em] uppercase text-gold hover:underline md:col-span-1 md:text-right">Manage</button>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Booking history">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <tr><th className="py-3">Service</th><th>Date</th><th>Status</th><th className="text-right">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookingHistory.map((b) => (
                    <tr key={b.id}>
                      <td className="py-4 text-charcoal">{b.service}</td>
                      <td className="text-muted-foreground">{b.date}</td>
                      <td className="text-muted-foreground">{b.status}</td>
                      <td className="text-right font-display text-charcoal">£{b.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>

            <Panel title="Favourite services">
              <div className="grid gap-4 sm:grid-cols-3">
                {services.slice(0, 3).map((s) => (
                  <div key={s.id} className="bg-cream p-4">
                    <Heart className="h-4 w-4 text-gold" />
                    <p className="mt-3 font-display text-charcoal">{s.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">£{s.price} · {s.duration}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-8">
            <Panel title="Notifications" icon={<Bell className="h-4 w-4 text-gold" />}>
              <ul className="space-y-4">
                {customerNotifications.map((n) => (
                  <li key={n.id} className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
                    <div className="flex-1">
                      <p className="text-sm text-charcoal">{n.text}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{n.time} ago</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Discount coupons" icon={<Gift className="h-4 w-4 text-gold" />}>
              <ul className="space-y-3">
                {coupons.map((c) => (
                  <li key={c.code} className="flex items-center justify-between border border-dashed border-champagne/70 p-4">
                    <div>
                      <p className="font-display text-lg text-charcoal">{c.code}</p>
                      <p className="text-xs text-muted-foreground">{c.label}</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Exp {c.expires}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Profile" icon={<Settings className="h-4 w-4 text-gold" />}>
              <div className="space-y-2 text-sm">
                <Row k="Name" v={c.name} />
                <Row k="Email" v={c.email} />
                <Row k="Tier" v={c.tier} />
              </div>
              <button className="mt-5 w-full rounded-full border border-charcoal py-3 text-[11px] tracking-[0.2em] uppercase text-charcoal hover:bg-charcoal hover:text-ivory">
                Edit Profile
              </button>
            </Panel>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Stat({ icon, label, value, sub, progress }: { icon: React.ReactNode; label: string; value: string; sub: string; progress?: number }) {
  return (
    <div className="bg-card p-7 shadow-soft">
      <div className="flex items-center gap-2">{icon}<span className="eyebrow">{label}</span></div>
      <p className="mt-4 font-display text-4xl text-charcoal">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      {progress !== undefined && (
        <div className="mt-4 h-1 w-full bg-cream">
          <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card p-6 shadow-soft md:p-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-display text-lg text-charcoal">{title}</h3>
        {icon}
      </div>
      <div className="pt-5">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-charcoal">{v}</span>
    </div>
  );
}
