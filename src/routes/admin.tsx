import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { ACCESS_LEVELS } from "@/lib/auth-types";
import { SALON_CONFIG } from "@/lib/salon-config";
import {
  adminMetrics,
  adminBookings,
  adminCustomers,
  adminReviews,
  popularServices,
  services,
} from "@/lib/mock-data";
import {
  LayoutDashboard, Calendar, Users, Star, Gift, Tag, Scissors,
  Image as ImageIcon, Instagram, Settings, TrendingUp, ShieldCheck, LogOut, Mail,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Admin — ${SALON_CONFIG.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  ),
});

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "customers", label: "Customers", icon: Users },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "loyalty", label: "Loyalty", icon: Gift },
  { id: "discounts", label: "Promotions", icon: Tag },
  { id: "pricing", label: "Pricing", icon: Scissors },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "admins", label: "Admin Access", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof tabs)[number]["id"];

function AdminDashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const { session, signOut } = useAuth();
  const initial = session?.profile.full_name?.[0] || "A";

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-cream md:flex md:flex-col">
        <div className="border-b border-border px-6 py-6">
          <Link to="/" className="font-display text-lg text-charcoal">{SALON_CONFIG.name}</Link>
          <p className="eyebrow mt-1">Admin Console</p>
        </div>
        <nav className="flex-1 p-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
                tab === t.id ? "bg-charcoal text-ivory" : "text-charcoal hover:bg-ivory"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4 md:px-10">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="font-display text-2xl text-charcoal capitalize">{tab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-charcoal">
              View Site →
            </Link>
            <button
              onClick={signOut}
              className="hidden items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-charcoal sm:flex"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-charcoal font-display text-sm text-ivory" title={session?.profile.full_name}>{initial}</div>
          </div>
        </header>

        {/* Mobile tab pills */}
        <div className="border-b border-border bg-card md:hidden">
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs ${tab === t.id ? "bg-charcoal text-ivory" : "bg-cream text-charcoal"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <main className="px-5 py-8 md:px-10 md:py-10">
          {tab === "overview" && <Overview />}
          {tab === "bookings" && <BookingsTab />}
          {tab === "customers" && <CustomersTab />}
          {tab === "reviews" && <ReviewsTab />}
          {tab === "loyalty" && <LoyaltyTab />}
          {tab === "discounts" && <DiscountsTab />}
          {tab === "pricing" && <PricingTab />}
          {tab === "gallery" && <GalleryTab />}
          {tab === "instagram" && <InstagramTab />}
          {tab === "admins" && <AdminsTab />}
          {tab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

function Overview() {
  const m = adminMetrics;
  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-4">
        <Metric label="Monthly revenue" value={`£${m.monthlyRevenue.toLocaleString()}`} delta={`+${m.monthlyRevenueDelta}%`} />
        <Metric label="Bookings" value={m.totalBookings.toString()} delta={`+${m.totalBookingsDelta}%`} />
        <Metric label="Returning customers" value={`${m.returningCustomers}%`} delta="of all visits" />
        <Metric label="Loyalty members" value={m.loyaltyMembers.toLocaleString()} delta={`★ ${m.satisfaction} avg`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Revenue trend" className="lg:col-span-2">
          <SparkChart />
        </Card>
        <Card title="Popular services">
          <ul className="space-y-4">
            {popularServices.map((s) => {
              const max = popularServices[0].bookings;
              const w = (s.bookings / max) * 100;
              return (
                <li key={s.name}>
                  <div className="flex justify-between text-sm text-charcoal">
                    <span>{s.name}</span><span className="text-muted-foreground">{s.bookings}</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full bg-cream"><div className="h-full bg-gold" style={{ width: `${w}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card title="Today's chair">
        <TableBookings rows={adminBookings.slice(0, 4)} />
      </Card>
    </div>
  );
}

function SparkChart() {
  const data = [22, 28, 25, 33, 30, 41, 38, 47, 44, 52, 49, 58];
  const max = Math.max(...data);
  return (
    <div>
      <p className="font-display text-3xl text-charcoal">£42,860 <span className="text-sm text-gold">▲ 12.4%</span></p>
      <p className="eyebrow mt-1">Last 12 weeks</p>
      <div className="mt-6 flex h-44 items-end gap-2">
        {data.map((v, i) => (
          <div key={i} className="flex-1 bg-charcoal/85 transition hover:bg-gold" style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
    </div>
  );
}

function BookingsTab() {
  return <BookingDiary />;
}


function CustomersTab() {
  return (
    <Card title="Customers">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr><th className="py-3">Name</th><th>Tier</th><th>Visits</th><th>Total spend</th><th>Last visit</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {adminCustomers.map((c) => (
              <tr key={c.name}>
                <td className="py-4 text-charcoal">{c.name}</td>
                <td><span className="rounded-full bg-cream px-3 py-1 text-[11px] tracking-[0.15em] uppercase">{c.tier}</span></td>
                <td className="text-muted-foreground">{c.visits}</td>
                <td className="font-display text-charcoal">£{c.spend.toLocaleString()}</td>
                <td className="text-muted-foreground">{c.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ReviewsTab() {
  return (
    <Card title="Latest reviews">
      <ul className="space-y-5">
        {adminReviews.map((r, i) => (
          <li key={i} className="border-b border-border pb-5 last:border-0">
            <div className="flex items-center justify-between">
              <p className="font-display text-charcoal">{r.name}</p>
              <span className="text-xs text-muted-foreground">{r.date} ago</span>
            </div>
            <div className="mt-1 flex gap-0.5 text-gold">
              {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-current" />)}
            </div>
            <p className="mt-3 font-serif text-lg italic text-charcoal">"{r.text}"</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function LoyaltyTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Programme settings">
        <Field label="Programme name" defaultValue={SALON_CONFIG.loyalty.name} />
        <Field label="Points per £1 spent" defaultValue={SALON_CONFIG.loyalty.pointsPerPound.toString()} />
        <SaveBar />
      </Card>
      <Card title="Tiers">
        <ul className="space-y-3">
          {SALON_CONFIG.loyalty.tiers.map((t) => (
            <li key={t.name} className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <p className="font-display text-charcoal">{t.name}</p>
                <p className="text-xs text-muted-foreground">From {t.min} pts</p>
              </div>
              <span className="text-sm text-muted-foreground">{t.perk}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function DiscountsTab() {
  return (
    <Card title="Discount codes">
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(SALON_CONFIG.discounts).map(([k, v]) => (
          <div key={k} className="border border-dashed border-champagne/70 p-5">
            <p className="eyebrow">{k}</p>
            <p className="mt-2 font-display text-2xl text-charcoal">{v.code}</p>
            <p className="mt-1 text-sm text-muted-foreground">{v.value}</p>
          </div>
        ))}
      </div>
      <SaveBar />
    </Card>
  );
}

function PricingTab() {
  return (
    <Card title="Service pricing">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr><th className="py-3">Service</th><th>Duration</th><th>Price (£)</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((s) => (
              <tr key={s.id}>
                <td className="py-3 text-charcoal">{s.name}</td>
                <td className="text-muted-foreground">{s.duration}</td>
                <td><input defaultValue={s.price} className="w-20 border border-border bg-ivory px-2 py-1.5 text-sm" /></td>
                <td className="text-right text-[11px] tracking-[0.2em] uppercase text-gold">Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function GalleryTab() {
  return (
    <Card title="Gallery">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {services.slice(0, 8).map((s, i) => (
          <div key={i} className="relative aspect-square overflow-hidden bg-cream">
            <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
          </div>
        ))}
        <div className="grid aspect-square place-items-center border border-dashed border-champagne text-sm text-gold">+ Upload</div>
      </div>
    </Card>
  );
}

function InstagramTab() {
  return (
    <Card title="Instagram feed">
      <Field label="Account handle" defaultValue={SALON_CONFIG.social.instagram} />
      <Field label="Display posts" defaultValue="6" />
      <SaveBar />
    </Card>
  );
}

function SettingsTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="House identity">
        <Field label="Salon name {{SALON_NAME}}" defaultValue={SALON_CONFIG.name} />
        <Field label="Logo mark" defaultValue={SALON_CONFIG.logoMark} />
        <Field label="Tagline" defaultValue={SALON_CONFIG.tagline} />
        <Field label="Address" defaultValue={SALON_CONFIG.address} />
        <SaveBar />
      </Card>

      <Card title="Contact">
        <Field label="Phone" defaultValue={SALON_CONFIG.phone} />
        <Field label="WhatsApp" defaultValue={SALON_CONFIG.whatsapp} />
        <Field label="Email" defaultValue={SALON_CONFIG.email} />
        <Field label="Google Business" defaultValue={SALON_CONFIG.googleBusiness} />
        <SaveBar />
      </Card>

      <Card title="Opening hours">
        {SALON_CONFIG.hours.map((h) => (
          <div key={h.day} className="grid grid-cols-2 gap-3 py-2">
            <input defaultValue={h.day} className="border border-border bg-ivory px-3 py-2 text-sm" />
            <input defaultValue={h.time} className="border border-border bg-ivory px-3 py-2 text-sm" />
          </div>
        ))}
        <SaveBar />
      </Card>

      <Card title="Social handles">
        <Field label="Instagram" defaultValue={SALON_CONFIG.social.instagram} />
        <Field label="Facebook" defaultValue={SALON_CONFIG.social.facebook} />
        <Field label="TikTok" defaultValue={SALON_CONFIG.social.tiktok} />
        <SaveBar />
      </Card>

      <Card title="SEO metadata" className="lg:col-span-2">
        <Field label="Title" defaultValue={SALON_CONFIG.seo.title} />
        <Field label="Description" defaultValue={SALON_CONFIG.seo.description} />
        <SaveBar />
      </Card>
    </div>
  );
}

function Card({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`bg-card p-6 shadow-soft md:p-8 ${className}`}>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-display text-lg text-charcoal">{title}</h3>
        <TrendingUp className="h-4 w-4 text-gold" />
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

function Metric({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="bg-card p-6 shadow-soft">
      <span className="eyebrow">{label}</span>
      <p className="mt-3 font-display text-3xl text-charcoal">{value}</p>
      <p className="mt-1 text-xs text-gold">{delta}</p>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block py-2">
      <span className="eyebrow">{label}</span>
      <input defaultValue={defaultValue} className="mt-2 w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none focus:border-charcoal" />
    </label>
  );
}

function SaveBar() {
  return (
    <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
      <button className="rounded-full border border-border px-5 py-2 text-[11px] tracking-[0.2em] uppercase text-charcoal">Discard</button>
      <button className="rounded-full bg-charcoal px-5 py-2 text-[11px] tracking-[0.2em] uppercase text-ivory">Save Changes</button>
    </div>
  );
}

function AdminsTab() {
  const [invites, setInvites] = useState<{ email: string; level: string; status: string }[]>([
    { email: "edmund@hawthorneandvale.co.uk", level: "Owner", status: "active" },
    { email: "victoria@hawthorneandvale.co.uk", level: "Manager", status: "active" },
    { email: "harriet@hawthorneandvale.co.uk", level: "Front Desk", status: "invited" },
  ]);
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("Manager");

  function invite(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setInvites([{ email, level, status: "invited" }, ...invites]);
    setEmail("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <Card title="Invite a new admin">
        <form onSubmit={invite} className="space-y-4">
          <p className="eyebrow">Email address</p>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@hawthorneandvale.co.uk"
              className="w-full border border-border bg-ivory px-3 py-2.5 text-sm outline-none focus:border-charcoal"
            />
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="border border-border bg-ivory px-3 py-2.5 text-sm">
              {ACCESS_LEVELS.map((l) => <option key={l.level}>{l.level}</option>)}
            </select>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory">
            <Mail className="h-3.5 w-3.5" /> Send invitation
          </button>
        </form>

        <div className="mt-7 border-t border-border pt-5">
          <p className="eyebrow mb-3">Access levels</p>
          <ul className="space-y-3">
            {ACCESS_LEVELS.map((l) => (
              <li key={l.level} className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0">
                <div>
                  <p className="font-display text-charcoal">{l.level}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{l.description}</p>
                </div>
                <span className="shrink-0 text-[11px] tracking-[0.18em] uppercase text-gold">{l.permissions} perms</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title="Active & pending admins">
        <ul className="space-y-3">
          {invites.map((i) => (
            <li key={i.email} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0">
              <div className="min-w-0">
                <p className="truncate font-display text-sm text-charcoal">{i.email}</p>
                <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">{i.level}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase ${
                i.status === "active" ? "bg-cream text-charcoal" : "bg-gold text-charcoal"
              }`}>{i.status}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
