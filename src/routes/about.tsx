import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import heroImg from "@/assets/hero-salon.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About Us — ${SALON_CONFIG.name} Barber & Unisex Salon, Ashford` },
      { name: "description", content: "Meet the team behind Lux & Glow, a barber and unisex beauty salon on Woodthorpe Road in Ashford, TW15." },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pt-16 pb-24 md:grid-cols-12 md:px-10 md:pt-24">
        <div className="md:col-span-5">
          <span className="eyebrow">{SALON_CONFIG.established}</span>
          <h1 className="mt-4 font-display text-4xl text-charcoal md:text-6xl">A house of craft, considered to the inch.</h1>
        </div>
        <div className="space-y-6 text-muted-foreground md:col-span-6 md:col-start-7 md:pt-4">
          <p>
            {SALON_CONFIG.name} began as a single chair on Woodthorpe Road, opened by two friends with a quiet belief: that a
            client's grooming ought to feel like a private appointment with a tailor, not a transaction.
          </p>
          <p>
            Since day one, the philosophy hasn't moved an inch. Every stylist and barber is fully qualified and experienced. Every
            ritual — the warm towels, the hand-blended oils, the single-blade finish — is performed without rush, without compromise.
          </p>
          <p>
            We are a member's house first. A grooming destination second. A traditional barber, never.
          </p>
        </div>
      </section>

      <section className="border-y border-border">
        <img src={heroImg} alt="The salon" loading="lazy" className="h-[60vh] w-full object-cover" />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            { t: "Theo Marlowe", r: "Master Barber · Co-founder", b: "18 years. Trained in Florence." },
            { t: "Sebastian Ash", r: "Master Barber", b: "14 years. Wedding & editorial specialist." },
            { t: "Henry Caldwell", r: "Master Barber", b: "12 years. Heritage shave expert." },
          ].map((p) => (
            <div key={p.t}>
              <div className="aspect-[4/5] bg-cream" />
              <h3 className="mt-5 font-display text-2xl text-charcoal">{p.t}</h3>
              <p className="eyebrow mt-2">{p.r}</p>
              <p className="mt-3 text-sm text-muted-foreground">{p.b}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
