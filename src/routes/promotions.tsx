import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import { promotionsPage } from "@/lib/mock-data-extended";
import { Gift, Sparkles, Calendar, Users } from "lucide-react";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: `Offers & Seasonal Rituals — ${SALON_CONFIG.name}` },
      { name: "description", content: "A small, curated selection of seasonal offers and member-only rituals." },
      { property: "og:title", content: `Offers — ${SALON_CONFIG.name}` },
      { property: "og:description", content: "Welcome ritual, referral, member-only and seasonal offers." },
    ],
    links: [{ rel: "canonical", href: "/promotions" }],
  }),
  component: PromotionsPage,
});

function PromotionsPage() {
  const { hero, firstVisit, seasonal, referral, member } = promotionsPage;

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-12 md:px-10 md:pt-24">
        <div className="flex items-center gap-3"><span className="gold-rule" /><span className="eyebrow">{hero.eyebrow}</span></div>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] text-charcoal md:text-6xl">{hero.title}</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">{hero.body}</p>
      </section>

      {/* Welcome + Referral cards */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10 md:pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon={Sparkles}
            eyebrow="First Visit"
            title={firstVisit.title}
            body={firstVisit.body}
            code={firstVisit.code}
            note={firstVisit.expires}
            tone="light"
          />
          <FeatureCard
            icon={Users}
            eyebrow="Referral"
            title={referral.title}
            body={referral.body}
            code={referral.code}
            note="No expiry"
            tone="dark"
          />
        </div>
      </section>

      {/* Seasonal */}
      <section className="bg-cream/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
          <div className="flex items-center gap-3"><span className="gold-rule" /><span className="eyebrow">Seasonal</span></div>
          <h2 className="mt-4 font-display text-3xl text-charcoal md:text-5xl">Of the moment.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {seasonal.map((s) => (
              <article key={s.title} className="group flex flex-col bg-ivory p-8 shadow-soft transition hover:shadow-luxe">
                <Calendar className="h-6 w-6 text-gold" strokeWidth={1.2} />
                <p className="mt-5 text-[11px] tracking-[0.2em] uppercase text-gold">{s.window}</p>
                <h3 className="mt-2 font-display text-2xl text-charcoal">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{s.body}</p>
                <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
                  <code className="font-mono text-xs tracking-[0.2em] text-charcoal">{s.code}</code>
                  <Link to="/booking" className="text-[11px] tracking-[0.2em] uppercase text-charcoal group-hover:text-gold">
                    Reserve →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Member only */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="eyebrow">Members only</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal md:text-5xl">Reserved for the Circle.</h2>
            <p className="mt-5 text-muted-foreground">
              Quiet perks held back for our Glow Circle members — never advertised, always offered.
            </p>
            <Link to="/loyalty" className="mt-8 inline-block rounded-full bg-charcoal px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-ivory hover:opacity-90">
              Discover membership
            </Link>
          </div>
          <ul className="md:col-span-7 grid gap-px bg-border">
            {member.map((m, i) => (
              <li key={m} className="flex items-center gap-5 bg-ivory p-6">
                <span className="font-display text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-lg text-charcoal">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gift voucher */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:px-10 md:py-28">
          <div>
            <Gift className="h-8 w-8 text-champagne" strokeWidth={1.2} />
            <h2 className="mt-6 font-display text-3xl md:text-5xl">Gift, gracefully.</h2>
            <p className="mt-4 max-w-md text-ivory/75">
              Hand-pressed envelopes, bicycle-delivered within Ashford. From a single shave to a year of cuts.
            </p>
          </div>
          <div className="flex items-end justify-start gap-4 md:justify-end">
            <Link to="/contact" className="rounded-full border border-champagne px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-champagne hover:bg-champagne hover:text-charcoal">
              Order a gift card
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function FeatureCard({
  icon: Icon,
  eyebrow,
  title,
  body,
  code,
  note,
  tone,
}: {
  icon: typeof Sparkles;
  eyebrow: string;
  title: string;
  body: string;
  code: string;
  note: string;
  tone: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <article className={`relative overflow-hidden p-10 md:p-12 ${dark ? "bg-charcoal text-ivory" : "bg-cream text-charcoal"}`}>
      <Icon className={`h-8 w-8 ${dark ? "text-champagne" : "text-gold"}`} strokeWidth={1.2} />
      <p className={`mt-6 text-[11px] tracking-[0.2em] uppercase ${dark ? "text-champagne" : "text-gold"}`}>{eyebrow}</p>
      <h3 className="mt-3 font-display text-3xl md:text-4xl">{title}</h3>
      <p className={`mt-4 max-w-md ${dark ? "text-ivory/75" : "text-muted-foreground"}`}>{body}</p>
      <div className={`mt-8 flex items-center justify-between border-t pt-5 ${dark ? "border-ivory/15" : "border-border"}`}>
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-60">Code</p>
          <code className="font-mono text-base tracking-[0.2em]">{code}</code>
        </div>
        <span className="text-[11px] tracking-[0.18em] uppercase opacity-60">{note}</span>
      </div>
    </article>
  );
}
