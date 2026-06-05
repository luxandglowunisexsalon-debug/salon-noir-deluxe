import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import { membershipPlans, packageDeals, groomPackages } from "@/lib/mock-data-extended";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: `Pricing & Membership — ${SALON_CONFIG.name}` },
      { name: "description", content: "Membership tiers, curated packages and wedding grooming offers from our Mayfair house." },
      { property: "og:title", content: `Pricing & Membership — ${SALON_CONFIG.name}` },
      { property: "og:description", content: "Bronze, Silver and Gold memberships. Curated packages. Bespoke wedding grooming." },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-12 md:px-10 md:pt-24">
        <div className="flex items-center gap-3"><span className="gold-rule" /><span className="eyebrow">Pricing & Membership</span></div>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] text-charcoal md:text-6xl">
          A house worth keeping — by the month, the visit or the season.
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Three considered ways to belong, plus curated packages for the diary that requires a little more.
        </p>
      </section>

      {/* Memberships */}
      <section className="bg-cream/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
          <div className="flex items-end justify-between">
            <div>
              <span className="eyebrow">Memberships</span>
              <h2 className="mt-3 font-display text-3xl text-charcoal md:text-5xl">The Vale Circle</h2>
            </div>
            <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
              Cancel any month with a single message to your concierge.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {membershipPlans.map((p) => (
              <article
                key={p.tier}
                className={`relative bg-card p-8 md:p-10 transition ${
                  p.featured ? "shadow-luxe md:-mt-6 md:pb-14 border border-champagne/40" : "shadow-soft"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 bg-charcoal px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase text-ivory">
                    <Sparkles className="h-3 w-3 text-champagne" /> Most chosen
                  </span>
                )}
                <p className="eyebrow">{p.tier}</p>
                <p className="mt-5 font-serif text-lg italic text-charcoal/80">{p.tagline}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl text-charcoal">£{p.price}</span>
                  <span className="text-sm text-muted-foreground">/ {p.cadence}</span>
                </div>
                <div className="gold-rule mt-7" />
                <ul className="mt-7 space-y-3 text-sm text-charcoal">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/booking"
                  className={`mt-9 block rounded-full py-3.5 text-center text-[12px] tracking-[0.2em] uppercase transition ${
                    p.featured
                      ? "bg-charcoal text-ivory hover:opacity-90"
                      : "border border-charcoal/30 text-charcoal hover:border-charcoal"
                  }`}
                >
                  Join {p.tier}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Packages */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="eyebrow">Curated Packages</span>
            <h2 className="mt-4 font-display text-3xl text-charcoal md:text-5xl">
              Bundled, beautifully.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Three signature combinations, each priced below their à la carte sum.
            </p>
          </div>
          <div className="grid gap-5 md:col-span-8">
            {packageDeals.map((d) => (
              <div key={d.name} className="grid items-center gap-6 border border-border bg-ivory p-7 md:grid-cols-12">
                <div className="md:col-span-7">
                  <h3 className="font-display text-2xl text-charcoal">{d.name}</h3>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    {d.items.map((i) => (
                      <li key={i} className="before:mr-2 before:text-gold before:content-['—']">{i}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between md:col-span-5 md:justify-end md:gap-8">
                  <div className="text-right">
                    <span className="block text-[11px] tracking-[0.2em] uppercase text-gold">Save £{d.saving}</span>
                    <span className="font-display text-3xl text-charcoal">£{d.price}</span>
                  </div>
                  <Link to="/booking" className="rounded-full border border-charcoal px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-charcoal hover:bg-charcoal hover:text-ivory">
                    Reserve
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Packages */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="flex items-center gap-3"><span className="gold-rule" /><span className="text-[11px] tracking-[0.2em] uppercase text-champagne">Wedding Grooming</span></div>
          <h2 className="mt-4 max-w-2xl font-display text-3xl md:text-5xl">The day deserves to be unhurried.</h2>
          <p className="mt-5 max-w-lg text-ivory/70">
            Three bespoke offers for the groom, his party, or the most private of estates.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {groomPackages.map((g) => (
              <article key={g.name} className="border border-ivory/15 p-8">
                <p className="text-[11px] tracking-[0.2em] uppercase text-champagne">{g.duration}</p>
                <h3 className="mt-4 font-display text-2xl text-ivory">{g.name}</h3>
                <p className="mt-3 text-sm text-ivory/70">{g.body}</p>
                <ul className="mt-6 space-y-2 text-sm text-ivory/80">
                  {g.includes.map((i) => (
                    <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-champagne" /> {i}</li>
                  ))}
                </ul>
                <div className="mt-7 flex items-center justify-between border-t border-ivory/15 pt-5">
                  <span className="font-display text-2xl text-champagne">£{g.price}</span>
                  <Link to="/contact" className="text-[11px] tracking-[0.2em] uppercase text-ivory hover:text-champagne">Enquire →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty savings */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="eyebrow">Loyalty Savings</span>
            <h2 className="mt-4 font-display text-3xl text-charcoal md:text-5xl">
              Every pound is remembered.
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Earn {SALON_CONFIG.loyalty.pointsPerPound} points for every £1 spent.
              Points convert quietly into perks — never asked for, always offered.
            </p>
            <Link to="/loyalty" className="mt-8 inline-block rounded-full border border-charcoal px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-charcoal hover:bg-charcoal hover:text-ivory">
              Discover The Vale Circle
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "£100", l: "= 500 points" },
              { v: "500", l: "Brass tier perks" },
              { v: "1,500", l: "Champagne benefits" },
              { v: "4,000", l: "The Vale tier" },
            ].map((s) => (
              <div key={s.l} className="bg-cream p-7 text-center">
                <p className="font-display text-3xl text-charcoal">{s.v}</p>
                <p className="mt-1 text-xs tracking-[0.18em] uppercase text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
