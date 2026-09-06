import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SALON_CONFIG } from "@/lib/salon-config";
import {
  member,
  nextAppointment,
  upcoming,
  history,
  tiers,
  rewards,
  couponList,
  notifs,
  favouriteServices,
  preferences,
  referrals,
  faqs,
} from "@/lib/dashboard-mock";
import {
  LayoutDashboard,
  CalendarDays,
  History,
  Crown,
  Gift,
  Ticket,
  Bell,
  Heart,
  UserRound,
  LifeBuoy,
  ChevronRight,
  Check,
  Sparkles,
  Star,
  MapPin,
  Clock,
  Copy,
  Share2,
  MessageCircle,
  Phone,
  Mail,
  Plus,
  Search,
  ArrowUpRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: `Members Club — ${SALON_CONFIG.name}` },
      { name: "description", content: "Your private members' diary, rewards and grooming history." },
    ],
  }),
  component: () => (
    <ProtectedRoute role="customer">
      <DashboardPage />
    </ProtectedRoute>
  ),
});

type SectionId =
  | "overview"
  | "appointments"
  | "history"
  | "loyalty"
  | "rewards"
  | "coupons"
  | "notifications"
  | "favourites"
  | "profile"
  | "referrals"
  | "support";

const NAV: { id: SectionId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "history", label: "Booking History", icon: History },
  { id: "loyalty", label: "Loyalty Club", icon: Crown },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "coupons", label: "Coupons", icon: Ticket },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "favourites", label: "Favourites", icon: Heart },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "referrals", label: "Refer & Earn", icon: Share2 },
  { id: "support", label: "Support", icon: LifeBuoy },
];

const MOBILE_NAV: SectionId[] = ["overview", "appointments", "rewards", "notifications", "profile"];

function DashboardPage() {
  const [section, setSection] = useState<SectionId>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const unread = notifs.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar (mobile) */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-ivory/95 px-5 py-3 backdrop-blur">
        <Link to="/" className="font-display text-lg text-charcoal">{SALON_CONFIG.name}</Link>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="rounded-full border border-border p-2 text-charcoal"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <div className="flex">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 border-r border-border bg-cream">
          <SidebarContent
            section={section}
            onSelect={(s) => setSection(s)}
            unread={unread}
          />
        </aside>

        {/* Sidebar — mobile drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-charcoal/40 animate-fade-in" onClick={() => setMobileNavOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-cream shadow-luxe animate-slide-in-right" style={{ animation: "slide-in-right 0.25s ease-out" }}>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-display text-lg text-charcoal">Members</span>
                <button onClick={() => setMobileNavOpen(false)} aria-label="Close"><X className="h-5 w-5 text-charcoal" /></button>
              </div>
              <SidebarContent
                section={section}
                onSelect={(s) => { setSection(s); setMobileNavOpen(false); }}
                unread={unread}
              />
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 lg:pl-72 pb-24 lg:pb-0">
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12 animate-fade-in" key={section}>
            {section === "overview" && <Overview onNavigate={setSection} />}
            {section === "appointments" && <Appointments />}
            {section === "history" && <BookingHistory />}
            {section === "loyalty" && <LoyaltyClub />}
            {section === "rewards" && <RewardsCentre />}
            {section === "coupons" && <Coupons />}
            {section === "notifications" && <Notifications />}
            {section === "favourites" && <Favourites />}
            {section === "profile" && <ProfileSettings />}
            {section === "referrals" && <ReferAndEarn />}
            {section === "support" && <Support />}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-ivory/95 backdrop-blur">
        <ul className="grid grid-cols-5">
          {MOBILE_NAV.map((id) => {
            const item = NAV.find((n) => n.id === id)!;
            const active = section === id;
            const Icon = item.icon;
            return (
              <li key={id}>
                <button
                  onClick={() => setSection(id)}
                  className={`flex w-full flex-col items-center gap-1 py-3 text-[10px] tracking-[0.12em] uppercase transition ${
                    active ? "text-charcoal" : "text-muted-foreground"
                  }`}
                >
                  <span className="relative">
                    <Icon className={`h-5 w-5 ${active ? "text-gold" : ""}`} strokeWidth={1.4} />
                    {id === "notifications" && unread > 0 && (
                      <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-gold" />
                    )}
                  </span>
                  {item.label.split(" ")[0]}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* ============================ SIDEBAR ============================ */
function SidebarContent({
  section,
  onSelect,
  unread,
}: {
  section: SectionId;
  onSelect: (s: SectionId) => void;
  unread: number;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-7 py-7 border-b border-border">
        <Link to="/" className="block">
          <p className="eyebrow">The Glow Circle</p>
          <p className="mt-2 font-display text-xl text-charcoal">{SALON_CONFIG.name}</p>
        </Link>
      </div>

      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3 rounded-lg bg-ivory p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-ivory font-display">
            {member.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm text-charcoal">{member.fullName}</p>
            <p className="flex items-center gap-1.5 text-[11px] tracking-[0.14em] uppercase text-gold">
              <Crown className="h-3 w-3" /> {member.tier} Member
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active = section === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={`group relative flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-sm transition ${
                    active
                      ? "bg-ivory text-charcoal shadow-soft"
                      : "text-charcoal/70 hover:bg-ivory/60 hover:text-charcoal"
                  }`}
                >
                  {active && <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-gold" />}
                  <Icon className={`h-4 w-4 ${active ? "text-gold" : "text-charcoal/60"}`} strokeWidth={1.5} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === "notifications" && unread > 0 && (
                    <span className="rounded-full bg-charcoal px-2 py-0.5 text-[10px] text-ivory">{unread}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-5">
        <Link
          to="/booking"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-3 text-[11px] tracking-[0.2em] uppercase text-ivory transition hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> New Booking
        </Link>
        <button className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-[11px] tracking-[0.18em] uppercase text-charcoal/60 hover:text-charcoal">
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </div>
  );
}

/* ============================ OVERVIEW ============================ */
function Overview({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const currentTier = tiers.find((t) => t.name === member.tier)!;
  const progress = Math.min(100, Math.round(((member.points - currentTier.min) / (currentTier.max - currentTier.min)) * 100));

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{member.tier} Member · since {member.memberSince}</p>
          <h1 className="mt-3 font-display text-3xl text-charcoal md:text-5xl">
            Welcome back, {member.firstName}.
          </h1>
          <p className="mt-2 text-muted-foreground">A quiet glance over your diary, rewards and rituals.</p>
        </div>
        <Link to="/booking" className="hidden md:inline-flex rounded-full bg-charcoal px-6 py-3 text-[12px] tracking-[0.2em] uppercase text-ivory hover:opacity-90">
          Book your chair
        </Link>
      </header>

      {/* Hero stat band */}
      <section className="grid gap-5 md:grid-cols-3">
        <StatCard
          icon={<Crown className="h-4 w-4 text-gold" />}
          eyebrow="Loyalty"
          value={member.points.toLocaleString()}
          unit="pts"
          sub={`${member.pointsToNextTier} to Platinum`}
          progress={progress}
        />
        <StatCard
          icon={<CalendarDays className="h-4 w-4 text-gold" />}
          eyebrow="Visits"
          value={`${member.lifetimeVisits}`}
          unit="lifetime"
          sub={`£${member.lifetimeSpend.toLocaleString()} lifetime value`}
        />
        <StatCard
          icon={<Gift className="h-4 w-4 text-gold" />}
          eyebrow="Active"
          value={`${rewards.filter((r) => r.available).length}`}
          unit="rewards"
          sub={`${couponList.filter((c) => c.status === "Active").length} coupons ready`}
        />
      </section>

      {/* Next appointment + quick actions */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 relative overflow-hidden bg-charcoal text-ivory p-8 md:p-10 shadow-luxe">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20" style={{ background: "var(--gradient-gold)" }} />
          <div className="relative">
            <p className="eyebrow text-champagne">Next Appointment</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">{nextAppointment.service}</h2>
            <p className="mt-2 font-serif italic text-ivory/80">with {nextAppointment.barber}</p>
            <div className="gold-rule mt-6" />
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <Meta icon={<CalendarDays className="h-4 w-4" />} label="Date" value={nextAppointment.date} />
              <Meta icon={<Clock className="h-4 w-4" />} label="Time" value={`${nextAppointment.time} · ${nextAppointment.duration}`} />
              <Meta icon={<MapPin className="h-4 w-4" />} label="Chair" value={nextAppointment.location} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-ivory px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-charcoal">View details</button>
              <button className="rounded-full border border-ivory/30 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory hover:border-ivory">Add to calendar</button>
              <button className="rounded-full border border-ivory/30 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory hover:border-ivory">Reschedule</button>
            </div>
          </div>
        </div>

        <div className="bg-card p-7 shadow-soft">
          <p className="eyebrow">Quick Actions</p>
          <ul className="mt-5 space-y-1">
            <QuickAction label="Book a chair" onClick={() => {}} to="/booking" />
            <QuickAction label="View rewards" onClick={() => onNavigate("rewards")} />
            <QuickAction label="Refer a friend" onClick={() => onNavigate("referrals")} />
            <QuickAction label="Update preferences" onClick={() => onNavigate("profile")} />
            <QuickAction label="WhatsApp concierge" onClick={() => onNavigate("support")} />
          </ul>
        </div>
      </section>

      {/* Lower row */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Panel title="Upcoming" actionLabel="See all" onAction={() => onNavigate("appointments")} className="lg:col-span-2">
          <ul className="divide-y divide-border">
            {upcoming.map((a) => (
              <li key={a.id} className="grid gap-2 py-4 md:grid-cols-12 md:items-center">
                <div className="md:col-span-5">
                  <p className="font-display text-lg text-charcoal">{a.service}</p>
                  <p className="text-xs text-muted-foreground">with {a.barber}</p>
                </div>
                <p className="text-sm text-charcoal md:col-span-4">{a.shortDate} · {a.time}</p>
                <StatusPill status={a.status} className="md:col-span-2" />
                <ChevronRight className="hidden md:block md:col-span-1 ml-auto h-4 w-4 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent Notifications" actionLabel="View all" onAction={() => onNavigate("notifications")}>
          <ul className="space-y-4">
            {notifs.slice(0, 3).map((n) => (
              <li key={n.id} className="flex gap-3">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.unread ? "bg-gold" : "bg-border"}`} />
                <div>
                  <p className="text-sm text-charcoal">{n.text}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{n.category} · {n.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </div>
  );
}

/* ============================ APPOINTMENTS ============================ */
function Appointments() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Your Diary"
        title="Upcoming Appointments"
        subtitle="Manage every reservation with a tap."
        action={
          <Link to="/booking" className="rounded-full bg-charcoal px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory hover:opacity-90">
            <Plus className="mr-1.5 inline h-3.5 w-3.5" /> New
          </Link>
        }
      />
      <MyAppointments />
    </div>
  );
}


/* ============================ BOOKING HISTORY ============================ */
function BookingHistory() {
  const [filter, setFilter] = useState<"all" | "fav">("all");
  const rows = filter === "fav" ? history.filter((h) => h.fav) : history;

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Archive" title="Booking History" subtitle={`${history.length} visits since ${member.memberSince}.`} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {[
            { id: "all", label: "All visits" },
            { id: "fav", label: "Favourites only" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`rounded-full border px-4 py-2 text-[11px] tracking-[0.18em] uppercase transition ${
                filter === t.id ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal hover:border-charcoal"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input className="bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search by service or barber…" />
        </div>
      </div>

      <div className="overflow-hidden bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-cream/70 text-left text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Barber</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((h) => (
              <tr key={h.id} className="transition hover:bg-cream/40">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {h.fav && <Heart className="h-3.5 w-3.5 text-gold" fill="currentColor" />}
                    <span className="font-display text-charcoal">{h.service}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{h.barber}</td>
                <td className="px-6 py-4 text-muted-foreground">{h.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < h.rating ? "text-gold" : "text-border"}`} fill="currentColor" />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-display text-charcoal">£{h.price}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[11px] tracking-[0.18em] uppercase text-charcoal hover:text-gold">Rebook →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================ LOYALTY CLUB ============================ */
function LoyaltyClub() {
  const currentIdx = tiers.findIndex((t) => t.name === member.tier);
  const current = tiers[currentIdx];
  const progress = Math.min(100, Math.round(((member.points - current.min) / (current.max - current.min)) * 100));

  return (
    <div className="space-y-10">
      <SectionHeader eyebrow="The Glow Circle" title="Loyalty Club" subtitle="A quieter way to belong." />

      {/* Tier hero */}
      <div className="relative overflow-hidden bg-charcoal p-10 text-ivory shadow-luxe md:p-14">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20" style={{ background: "var(--gradient-gold)" }} />
        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow text-champagne">Current Standing</p>
            <h2 className="mt-3 flex items-center gap-3 font-display text-5xl">
              <Crown className="h-10 w-10 text-champagne" strokeWidth={1.2} /> {member.tier}
            </h2>
            <p className="mt-4 text-ivory/75">You are {member.pointsToNextTier} points from your next standing.</p>
            <div className="mt-8">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ivory/60">
                <span>{member.points.toLocaleString()} pts</span>
                <span>{(current.max + 1).toLocaleString()} pts</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ivory/15">
                <div
                  className="h-full transition-all duration-1000"
                  style={{ width: `${progress}%`, background: "var(--gradient-gold)" }}
                />
              </div>
            </div>
          </div>
          <ul className="space-y-3">
            {current.perks.map((p) => (
              <li key={p} className="flex items-start gap-3 border-b border-ivory/10 pb-3 last:border-0">
                <Check className="mt-0.5 h-4 w-4 text-champagne" /> <span className="text-ivory/90">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tier ladder */}
      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t, i) => {
          const isCurrent = t.name === member.tier;
          const isPast = i < currentIdx;
          return (
            <article
              key={t.name}
              className={`relative overflow-hidden border p-8 transition ${
                isCurrent
                  ? "border-gold bg-card shadow-luxe"
                  : isPast
                    ? "border-border bg-cream/40"
                    : "border-border bg-card opacity-90"
              }`}
            >
              {isCurrent && (
                <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-charcoal">
                  Current
                </span>
              )}
              <Crown className={`h-7 w-7 ${isCurrent ? "text-gold" : "text-charcoal/40"}`} strokeWidth={1.2} />
              <h3 className="mt-5 font-display text-3xl text-charcoal">{t.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.min.toLocaleString()} – {t.max.toLocaleString()} pts</p>
              <div className="gold-rule mt-5" />
              <ul className="mt-5 space-y-2.5 text-sm text-charcoal">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" /> {p}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ REWARDS ============================ */
function RewardsCentre() {
  const [redeemed, setRedeemed] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Rewards Centre"
        title="Exchange your points"
        subtitle={`You have ${member.points.toLocaleString()} points to spend.`}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((r) => {
          const isRedeemed = redeemed.includes(r.id);
          const canRedeem = r.available && member.points >= r.points && !isRedeemed;
          return (
            <article
              key={r.id}
              className={`group relative overflow-hidden bg-card p-7 shadow-soft transition ${r.available ? "hover:shadow-luxe" : "opacity-60"}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-4xl text-gold">{r.image}</span>
                <span className="rounded-full bg-cream px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-charcoal">
                  {r.points.toLocaleString()} pts
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl text-charcoal">{r.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.note}</p>
              <div className="gold-rule mt-5" />
              <button
                disabled={!canRedeem}
                onClick={() => setRedeemed((p) => [...p, r.id])}
                className={`mt-5 w-full rounded-full py-2.5 text-[11px] tracking-[0.2em] uppercase transition ${
                  isRedeemed
                    ? "bg-cream text-charcoal/60"
                    : canRedeem
                      ? "bg-charcoal text-ivory hover:opacity-90"
                      : "border border-border text-charcoal/40"
                }`}
              >
                {isRedeemed ? "✓ Redeemed" : canRedeem ? "Redeem" : !r.available ? "Locked" : "Not enough points"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ COUPONS ============================ */
function Coupons() {
  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Promotions" title="Your Coupons" subtitle="Member-only offers, ready to use at checkout." />

      <div className="grid gap-5 md:grid-cols-2">
        {couponList.map((c) => {
          const redeemed = c.status === "Redeemed";
          return (
            <article
              key={c.code}
              className={`relative overflow-hidden p-7 transition ${redeemed ? "bg-cream/50 opacity-70" : "bg-card shadow-soft hover:shadow-luxe"}`}
              style={{
                backgroundImage: !redeemed
                  ? "repeating-linear-gradient(45deg, transparent 0 24px, oklch(0.95 0.018 82) 24px 25px)"
                  : undefined,
                backgroundSize: !redeemed ? "100% 100%" : undefined,
              }}
            >
              <div className="relative bg-card p-6 -m-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold">{c.status}</p>
                    <h3 className="mt-2 font-display text-2xl text-charcoal">{c.label}</h3>
                  </div>
                  <Ticket className="h-6 w-6 text-gold" strokeWidth={1.2} />
                </div>
                <div className="gold-rule mt-5" />
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">Code</p>
                    <code className="font-mono text-lg tracking-[0.2em] text-charcoal">{c.code}</code>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">Expires</p>
                    <p className="text-sm text-charcoal">{c.expires}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">{c.terms}</p>
                {!redeemed && (
                  <button className="mt-5 w-full rounded-full border border-charcoal py-2.5 text-[11px] tracking-[0.2em] uppercase text-charcoal hover:bg-charcoal hover:text-ivory">
                    <Copy className="mr-1.5 inline h-3.5 w-3.5" /> Copy code
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ NOTIFICATIONS ============================ */
function Notifications() {
  const [filter, setFilter] = useState<string>("All");
  const cats = ["All", "Appointment", "Reward", "Promotion", "Membership"];
  const rows = filter === "All" ? notifs : notifs.filter((n) => n.category === filter);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle={`${notifs.filter((n) => n.unread).length} unread message${notifs.filter((n) => n.unread).length === 1 ? "" : "s"}.`}
        action={<button className="text-[11px] tracking-[0.18em] uppercase text-charcoal hover:text-gold">Mark all read</button>}
      />

      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-2 text-[11px] tracking-[0.18em] uppercase transition ${
              filter === c ? "border-charcoal bg-charcoal text-ivory" : "border-border text-charcoal hover:border-charcoal"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-border bg-card shadow-soft">
        {rows.map((n) => (
          <li key={n.id} className={`group flex items-start gap-5 p-6 transition hover:bg-cream/40 ${n.unread ? "" : "opacity-75"}`}>
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-gold" : "bg-border"}`} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] tracking-[0.18em] uppercase text-charcoal">{n.category}</span>
                <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{n.time}</span>
              </div>
              <p className="mt-2 text-charcoal">{n.text}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================ FAVOURITES ============================ */
function Favourites() {
  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Saved" title="Favourite Services" subtitle="Re-book the rituals you return to." />

      <div className="grid gap-5 md:grid-cols-3">
        {favouriteServices.map((f) => (
          <article key={f.id} className="group flex flex-col bg-card p-7 shadow-soft transition hover:shadow-luxe">
            <Heart className="h-5 w-5 text-gold" fill="currentColor" />
            <h3 className="mt-5 font-display text-xl text-charcoal">{f.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.duration} · £{f.price}</p>
            <p className="mt-4 text-xs text-muted-foreground">Last booked {f.lastBooked}</p>
            <div className="gold-rule mt-5" />
            <Link to="/booking" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory hover:opacity-90">
              Book again <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        ))}
      </div>

      <div className="bg-card p-7 shadow-soft md:p-10">
        <p className="eyebrow">Personal Preferences</p>
        <h3 className="mt-3 font-display text-2xl text-charcoal">How you like it.</h3>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <PrefRow k="Favourite stylist" v={preferences.stylist} />
          <PrefRow k="Preferred service" v={preferences.service} />
          <PrefRow k="Preferred days" v={preferences.days.join(", ")} />
          <PrefRow k="Preferred times" v={preferences.times} />
          <PrefRow k="Communication" v={preferences.communication} />
        </div>
      </div>
    </div>
  );
}

/* ============================ PROFILE ============================ */
function ProfileSettings() {
  const [marketing, setMarketing] = useState({ email: true, whatsapp: true, sms: false, post: false });

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Account" title="Profile" subtitle="Your details, communication and marketing preferences." />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Personal details">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name" value={member.fullName} />
              <Field label="Email" value={member.email} />
              <Field label="Phone" value={member.phone} />
              <Field label="Member since" value={member.memberSince} readOnly />
              <div className="md:col-span-2">
                <Field label="Address" value={member.address} />
              </div>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button className="rounded-full border border-border px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-charcoal hover:border-charcoal">Cancel</button>
              <button className="rounded-full bg-charcoal px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory hover:opacity-90">Save changes</button>
            </div>
          </Panel>

          <Panel title="Communication preferences">
            <ul className="divide-y divide-border">
              {(["email", "whatsapp", "sms", "post"] as const).map((k) => (
                <li key={k} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-display text-charcoal capitalize">{k === "sms" ? "SMS" : k}</p>
                    <p className="text-xs text-muted-foreground">Receive {k === "post" ? "hand-pressed mail" : `${k} updates`} about your bookings and rewards.</p>
                  </div>
                  <Toggle on={marketing[k]} onChange={() => setMarketing({ ...marketing, [k]: !marketing[k] })} />
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="space-y-6">
          <div className="bg-charcoal p-8 text-ivory shadow-luxe">
            <p className="eyebrow text-champagne">Members Card</p>
            <p className="mt-6 font-display text-2xl">{member.fullName}</p>
            <p className="mt-1 text-ivory/70 text-sm">{member.tier} · No. 00{member.lifetimeVisits}284</p>
            <div className="gold-rule mt-5" />
            <p className="mt-5 text-[11px] tracking-[0.2em] uppercase text-ivory/60">Member since</p>
            <p className="mt-1 font-display">{member.memberSince}</p>
          </div>

          <Panel title="Security">
            <button className="w-full rounded-full border border-border py-2.5 text-[11px] tracking-[0.2em] uppercase text-charcoal hover:border-charcoal">Change password</button>
            <button className="mt-3 w-full rounded-full border border-border py-2.5 text-[11px] tracking-[0.2em] uppercase text-charcoal hover:border-charcoal">Two-factor authentication</button>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============================ REFER ============================ */
function ReferAndEarn() {
  const [copied, setCopied] = useState(false);
  const earned = referrals.filter((r) => r.status === "Joined").length * 25;

  return (
    <div className="space-y-10">
      <SectionHeader eyebrow="Refer & Earn" title="Share the Circle" subtitle="£25 credit for you. £25 for them." />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-charcoal p-10 text-ivory shadow-luxe">
          <p className="eyebrow text-champagne">Your Referral Link</p>
          <p className="mt-5 font-display text-2xl break-all">{member.referralLink}</p>
          <div className="gold-rule mt-6" />
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => { navigator.clipboard?.writeText(member.referralLink); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="rounded-full bg-ivory px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-charcoal"
            >
              <Copy className="mr-1.5 inline h-3.5 w-3.5" /> {copied ? "Copied" : "Copy link"}
            </button>
            <button className="rounded-full border border-ivory/30 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory hover:border-ivory">
              <MessageCircle className="mr-1.5 inline h-3.5 w-3.5" /> WhatsApp
            </button>
            <button className="rounded-full border border-ivory/30 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory hover:border-ivory">
              <Mail className="mr-1.5 inline h-3.5 w-3.5" /> Email
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          <StatCard icon={<Share2 className="h-4 w-4 text-gold" />} eyebrow="Referrals" value={`${referrals.filter((r) => r.status === "Joined").length}`} unit="joined" sub={`${referrals.length} invited`} />
          <StatCard icon={<Gift className="h-4 w-4 text-gold" />} eyebrow="Earned" value={`£${earned}`} unit="credit" sub="Ready to spend" />
        </div>
      </section>

      <Panel title="Your referrals">
        <table className="w-full text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <tr><th className="py-3">Name</th><th>Invited</th><th>Status</th><th className="text-right">Reward</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {referrals.map((r) => (
              <tr key={r.name}>
                <td className="py-4 font-display text-charcoal">{r.name}</td>
                <td className="py-4 text-muted-foreground">{r.date}</td>
                <td className="py-4">
                  <span className={`rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase ${r.status === "Joined" ? "bg-cream text-charcoal" : "bg-cream/50 text-muted-foreground"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-4 text-right font-display text-charcoal">{r.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ============================ SUPPORT ============================ */
function Support() {
  return (
    <div className="space-y-10">
      <SectionHeader eyebrow="We're here" title="Help & Support" subtitle="A concierge is one tap away." />

      <div className="grid gap-5 md:grid-cols-3">
        <SupportCard icon={MessageCircle} title="WhatsApp Concierge" sub="Average reply · 4 min" cta="Open WhatsApp" tone="dark" />
        <SupportCard icon={Sparkles} title="Live Chat" sub="Mon–Sat · 9am–8pm" cta="Start chat" />
        <SupportCard icon={Phone} title="Call us" sub={SALON_CONFIG.phone || "+44 20 7000 0184"} cta="Call now" />
      </div>

      <Panel title="Frequently asked">
        <ul className="divide-y divide-border">
          {faqs.map((f, i) => (
            <li key={i} className="group">
              <details className="py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="font-display text-lg text-charcoal">{f.q}</span>
                  <ChevronRight className="h-4 w-4 text-gold transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="bg-card p-8 shadow-soft md:p-10">
        <p className="eyebrow">Contact concierge</p>
        <h3 className="mt-3 font-display text-2xl text-charcoal">Send us a note.</h3>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Subject" value="" placeholder="What can we help with?" />
          <Field label="Reference (optional)" value="" placeholder="Booking ID" />
        </div>
        <div className="mt-5">
          <label className="block text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Message</label>
          <textarea rows={4} className="mt-2 w-full rounded-md border border-border bg-cream/40 px-4 py-3 text-charcoal outline-none focus:border-charcoal" />
        </div>
        <div className="mt-6 flex justify-end">
          <button className="rounded-full bg-charcoal px-7 py-3 text-[11px] tracking-[0.2em] uppercase text-ivory hover:opacity-90">Send</button>
        </div>
      </div>
    </div>
  );
}

/* ============================ SHARED ============================ */
function StatCard({ icon, eyebrow, value, unit, sub, progress }: { icon: ReactNode; eyebrow: string; value: string; unit?: string; sub: string; progress?: number }) {
  return (
    <div className="bg-card p-7 shadow-soft transition hover:shadow-luxe">
      <div className="flex items-center gap-2">{icon}<span className="eyebrow">{eyebrow}</span></div>
      <p className="mt-5 font-display text-4xl text-charcoal">
        {value}
        {unit && <span className="ml-2 text-sm font-sans uppercase tracking-[0.18em] text-muted-foreground">{unit}</span>}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      {progress !== undefined && (
        <div className="mt-5 h-1 w-full overflow-hidden bg-cream">
          <div className="h-full transition-all duration-1000" style={{ width: `${progress}%`, background: "var(--gradient-gold)" }} />
        </div>
      )}
    </div>
  );
}

function Panel({ title, actionLabel, onAction, children, className = "" }: { title: string; actionLabel?: string; onAction?: () => void; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card p-6 shadow-soft md:p-8 ${className}`}>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-display text-lg text-charcoal">{title}</h3>
        {actionLabel && (
          <button onClick={onAction} className="text-[11px] tracking-[0.18em] uppercase text-charcoal hover:text-gold">
            {actionLabel} →
          </button>
        )}
      </div>
      <div className="pt-5">{children}</div>
    </div>
  );
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-champagne">{icon} {label}</div>
      <p className="mt-1.5 font-display text-lg">{value}</p>
    </div>
  );
}

function QuickAction({ label, onClick, to }: { label: string; onClick?: () => void; to?: string }) {
  const cls = "group flex w-full items-center justify-between border-b border-border py-3 text-sm text-charcoal transition hover:text-gold last:border-0";
  if (to) return <li><Link to={to} className={cls}>{label} <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link></li>;
  return (
    <li>
      <button onClick={onClick} className={cls}>
        {label} <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </button>
    </li>
  );
}

function StatusPill({ status, className = "" }: { status: string; className?: string }) {
  const map: Record<string, string> = {
    Confirmed: "bg-cream text-charcoal",
    Pending: "bg-champagne/20 text-charcoal",
    Completed: "bg-cream text-muted-foreground",
  };
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] tracking-[0.18em] uppercase ${map[status] || "bg-cream"} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {status}
    </span>
  );
}

function SectionHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl text-charcoal md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

function Field({ label, value, placeholder, readOnly }: { label: string; value: string; placeholder?: string; readOnly?: boolean }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.18em] uppercase text-muted-foreground">{label}</label>
      <input
        defaultValue={value}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`mt-2 w-full rounded-md border border-border px-4 py-3 text-charcoal outline-none focus:border-charcoal ${readOnly ? "bg-cream/40 text-muted-foreground" : "bg-cream/40"}`}
      />
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-charcoal" : "bg-border"}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function PrefRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">{k}</span>
      <span className="font-display text-charcoal">{v}</span>
    </div>
  );
}

function SupportCard({ icon: Icon, title, sub, cta, tone = "light" }: { icon: typeof MessageCircle; title: string; sub: string; cta: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <article className={`flex flex-col p-7 shadow-soft transition hover:shadow-luxe ${dark ? "bg-charcoal text-ivory" : "bg-card text-charcoal"}`}>
      <Icon className={`h-7 w-7 ${dark ? "text-champagne" : "text-gold"}`} strokeWidth={1.2} />
      <h3 className="mt-5 font-display text-xl">{title}</h3>
      <p className={`mt-1 text-sm ${dark ? "text-ivory/70" : "text-muted-foreground"}`}>{sub}</p>
      <button className={`mt-6 self-start rounded-full px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase ${dark ? "bg-ivory text-charcoal" : "bg-charcoal text-ivory"} hover:opacity-90`}>
        {cta}
      </button>
    </article>
  );
}
