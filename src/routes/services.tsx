import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { services } from "@/lib/mock-data";
import { SALON_CONFIG } from "@/lib/salon-config";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: `Services — Barber, Hair & Beauty in Ashford | ${SALON_CONFIG.name}` },
      { name: "description", content: "Haircuts, skin fades, beard trims, colour, blow-dry, waxing and beauty treatments for women and men in Ashford, TW15." },
      { property: "og:title", content: `Services — Barber, Hair & Beauty in Ashford | ${SALON_CONFIG.name}` },
      { property: "og:description", content: "Haircuts, skin fades, beard trims, colour, blow-dry, waxing and beauty treatments for women and men in Ashford, TW15." },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-10 md:pt-24">
        <span className="eyebrow">The Menu</span>
        <h1 className="mt-4 font-display text-4xl text-charcoal md:text-6xl">Services</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Every service is performed by a qualified stylist or barber. Unhurried, considered, complete.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-10">
        <div className="grid gap-px bg-border">
          {services.map((s) => (
            <article key={s.id} className="grid gap-6 bg-ivory p-6 md:grid-cols-12 md:gap-10 md:p-10">
              <img src={s.image} alt={s.name} loading="lazy" className="aspect-[4/3] w-full rounded-[2px] object-cover md:col-span-3 md:aspect-square" />
              <div className="md:col-span-7">
                <span className="eyebrow">{s.category} · {s.duration}</span>
                <h3 className="mt-2 font-display text-2xl text-charcoal md:text-3xl">{s.name}</h3>
                <p className="mt-3 max-w-2xl text-muted-foreground">{s.description}</p>
              </div>
              <div className="flex items-center justify-between md:col-span-2 md:flex-col md:items-end md:justify-center">
                <span className="font-display text-3xl text-charcoal">£{s.price}</span>
                <Link to="/booking" className="rounded-full bg-charcoal px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory">
                  Reserve
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
