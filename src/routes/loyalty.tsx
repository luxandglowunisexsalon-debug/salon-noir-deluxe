import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import { membershipPlans } from "@/lib/mock-data-extended";
import { Check, Crown, Award, Gem } from "lucide-react";

export const Route = createFileRoute("/loyalty")({
  head: () => ({
    meta: [
      { title: `The Glow Circle — ${SALON_CONFIG.name}` },
      { name: "description", content: "Earn points on every visit to Lux & Glow in Ashford and unlock member rewards." },
      { property: "og:title", content: `The Glow Circle — ${SALON_CONFIG.name}` },
      { property: "og:description", content: "The Glow Circle loyalty rewards at our Ashford barber and unisex salon." },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/loyalty" }],
  }),
  component: LoyaltyPage,
});

const tierIcon = { Bronze: Award, Silver: Gem, Gold: Crown } as const;

function LoyaltyPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-16 pb-20 md:grid-cols-12 md:gap-12 md:px-10 md:pt-24 md:pb-28">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3"><span className="gold-rule" /><span className="eyebrow">Membership</span></div>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] text-charcoal md:text-[4rem]">
              {SALON_CONFIG.loyalty.name}.
              <span className="block font-serif italic text-gold">A quieter way to belong.</span>
            </h1>
            <p className="mt-6 max-w-lg text-muted-foreground">
              Membership at {SALON_CONFIG.name} is not a points scheme. It is a private register —
              three tiers of considered perks, designed like a club, kept like a confidence.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/booking" className="rounded-full bg-charcoal px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-ivory hover:opacity-90">Begin your membership</Link>
              <Link to="/contact" className="rounded-full border border-charcoal/30 px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-charcoal hover:border-charcoal">Speak with the concierge</Link>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="bg-charcoal p-10 text-ivory">
              <p className="text-[11px] tracking-[0.2em] uppercase text-champagne">Members today</p>
              <p className="mt-4 font-display text-6xl text-ivory">1,284</p>
              <div className="gold-rule mt-6" />
              <ul className="mt-7 space-y-4 text-sm text-ivory/85">
                {[
                  "Priority chairs, never the wait",
                  "Monthly grooming gift, hand-delivered",
                  "Private suite for Gold members",
                  "First refusal on limited retail",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 text-champagne" /> <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="flex items-end justify-between">
          <div>
            <span className="eyebrow">Three Tiers</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal md:text-5xl">Choose your standing.</h2>
          </div>
          <Link to="/pricing" className="hidden text-[11px] tracking-[0.2em] uppercase text-charcoal hover:text-gold md:block">
            See pricing →
          </Link>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {membershipPlans.map((p) => {
            const Icon = tierIcon[p.tier as keyof typeof tierIcon];
            return (
              <article key={p.tier} className="relative bg-ivory border border-border p-9 transition hover:shadow-luxe">
                <Icon className="h-8 w-8 text-gold" strokeWidth={1.2} />
                <h3 className="mt-6 font-display text-3xl text-charcoal">{p.tier}</h3>
                <p className="mt-2 font-serif italic text-charcoal/70">{p.tagline}</p>
                <p className="mt-7 font-display text-4xl text-charcoal">£{p.price}<span className="ml-1 text-sm font-sans text-muted-foreground">/ mo</span></p>
                <div className="gold-rule mt-6" />
                <ul className="mt-7 space-y-3 text-sm text-charcoal">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><span>{perk}</span></li>
                  ))}
                </ul>
                <Link to="/booking" className="mt-9 block rounded-full border border-charcoal py-3.5 text-center text-[12px] tracking-[0.2em] uppercase text-charcoal hover:bg-charcoal hover:text-ivory">
                  Join {p.tier}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal md:text-5xl">Quietly considered, never noisy.</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-4">
            {[
              { n: "01", t: "Enrol in a minute", d: "Choose your tier online or with our concierge." },
              { n: "02", t: "Visit", d: "Your barber and chair are remembered, every time." },
              { n: "03", t: "Earn quietly", d: "Points accrue automatically — no cards, no apps to chase." },
              { n: "04", t: "Receive", d: "Perks appear in your members' diary. Use them, or don't." },
            ].map((s) => (
              <div key={s.n} className="border-t border-champagne/50 pt-6">
                <p className="font-display text-gold">{s.n}</p>
                <h3 className="mt-3 font-display text-xl text-charcoal">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 py-20 md:px-10 md:py-28">
        <span className="eyebrow">Questions</span>
        <h2 className="mt-3 font-display text-3xl text-charcoal md:text-5xl">Frequently asked.</h2>
        <dl className="mt-12 divide-y divide-border border-y border-border">
          {[
            { q: "Can I pause my membership?", a: "Yes — pause for up to three months a year, with a single message to your concierge." },
            { q: "Are unused services rolled over?", a: "Silver and Gold members may roll one unused service into the following month." },
            { q: "Can I gift a membership?", a: "Beautifully. We deliver a hand-pressed envelope and a private welcome appointment." },
            { q: "Is there a joining fee?", a: "There is no joining fee. Membership is monthly, cancel anytime." },
          ].map((f) => (
            <div key={f.q} className="grid gap-3 py-7 md:grid-cols-12">
              <dt className="font-display text-lg text-charcoal md:col-span-5">{f.q}</dt>
              <dd className="text-muted-foreground md:col-span-7">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </SiteShell>
  );
}
