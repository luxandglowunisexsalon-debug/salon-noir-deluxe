import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/layout/SiteShell";
import { listServices } from "@/lib/booking/booking.functions";
import { SALON_CONFIG } from "@/lib/salon-config";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: `Services — Barber, Hair & Beauty in Ashford | ${SALON_CONFIG.name}` },
      {
        name: "description",
        content:
          "Haircuts, skin fades, beard trims, colour, blow-dry, waxing and beauty treatments for women and men in Ashford, TW15.",
      },
      {
        property: "og:title",
        content: `Services — Barber, Hair & Beauty in Ashford | ${SALON_CONFIG.name}`,
      },
      {
        property: "og:description",
        content:
          "Haircuts, skin fades, beard trims, colour, blow-dry, waxing and beauty treatments for women and men in Ashford, TW15.",
      },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const servicesQ = useQuery({ queryKey: ["services"], queryFn: () => listServices() });
  const services = servicesQ.data ?? [];
  const categories = [...new Set(services.map((service) => service.category ?? "Treatments"))];

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-10 md:pt-24">
        <span className="eyebrow">The Menu</span>
        <h1 className="mt-4 font-display text-4xl text-charcoal md:text-6xl">Services</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Every service is performed by a qualified stylist or barber. Unhurried, considered,
          complete.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-10">
        {servicesQ.isLoading ? (
          <p className="border border-dashed border-border p-8 text-sm text-muted-foreground">
            Loading the treatment menu…
          </p>
        ) : servicesQ.isError ? (
          <p className="border border-dashed border-destructive/40 p-8 text-sm text-destructive">
            The treatment menu is temporarily unavailable.
          </p>
        ) : services.length === 0 ? (
          <p className="border border-dashed border-border p-8 text-sm text-muted-foreground">
            No treatments are currently bookable.
          </p>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <section key={category}>
                <div className="flex items-center gap-3">
                  <span className="gold-rule" />
                  <h2 className="eyebrow">{category}</h2>
                </div>
                <div className="mt-4 divide-y divide-border border-y border-border">
                  {services
                    .filter((service) => (service.category ?? "Treatments") === category)
                    .map((service) => (
                      <article
                        key={service.id}
                        className="grid gap-3 py-5 md:grid-cols-[1fr_auto_auto] md:items-center md:gap-8"
                      >
                        <div>
                          <h3 className="font-display text-xl text-charcoal">{service.name}</h3>
                          {service.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {service.duration_minutes} min
                        </span>
                        <div className="flex items-center justify-between gap-6 md:justify-end">
                          <span className="font-display text-xl text-charcoal">
                            £
                            {(service.price_pence / 100).toFixed(
                              service.price_pence % 100 === 0 ? 0 : 2,
                            )}
                          </span>
                          <Link
                            to="/booking"
                            className="rounded-full bg-charcoal px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase text-ivory"
                          >
                            Book
                          </Link>
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
