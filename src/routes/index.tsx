import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import { services, testimonials, instagramFeed, beforeAfter } from "@/lib/mock-data";
import storefrontAsset from "@/assets/lux-glow-storefront.jpeg.asset.json";
import interiorAsset from "@/assets/lux-glow-interior-wide.jpeg.asset.json";
import windowAsset from "@/assets/lux-glow-window.jpeg.asset.json";
import { Star, Sparkles, Award, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SALON_CONFIG.seo.title },
      { name: "description", content: SALON_CONFIG.seo.description },
      { name: "keywords", content: SALON_CONFIG.seo.keywords },
      { property: "og:title", content: SALON_CONFIG.seo.title },
      { property: "og:description", content: SALON_CONFIG.seo.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://noble-manor-haven.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HairSalon",
          name: SALON_CONFIG.name,
          description: SALON_CONFIG.seo.description,
          url: "https://noble-manor-haven.lovable.app/",
          telephone: SALON_CONFIG.phone,
          priceRange: "££",
          address: {
            "@type": "PostalAddress",
            streetAddress: SALON_CONFIG.seo.streetAddress,
            addressLocality: SALON_CONFIG.seo.locality,
            addressRegion: SALON_CONFIG.seo.region,
            postalCode: SALON_CONFIG.seo.postalCode,
            addressCountry: SALON_CONFIG.seo.country,
          },
          areaServed: ["Ashford", "Staines-upon-Thames", "Feltham", "Sunbury", "Stanwell"],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "10:00",
              closes: "19:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "09:30",
              closes: "19:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Sunday",
              opens: "10:00",
              closes: "18:00",
            },
          ],
          sameAs: [SALON_CONFIG.googleBusiness],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = services.filter((s) => s.featured);
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-12 pb-20 md:grid-cols-12 md:gap-12 md:px-10 md:pt-20 md:pb-32">
          <div className="md:col-span-6 md:pt-12">
            <div className="flex items-center gap-3">
              <span className="gold-rule" />
              <span className="eyebrow">{SALON_CONFIG.established} · Ashford, TW15</span>
            </div>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] tracking-tight text-charcoal md:text-[4.2rem]">
              Barber & unisex salon in <em className="font-serif italic text-gold">Ashford</em>.
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              {SALON_CONFIG.name} is a barber and unisex beauty salon on Woodthorpe Road — precision
              cuts and skin fades, colour and styling, beard grooming, waxing and beauty treatments
              for women and men.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/booking"
                className="rounded-full bg-charcoal px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-ivory transition hover:opacity-90"
              >
                Book an Appointment
              </Link>
              <Link
                to="/services"
                className="rounded-full border border-charcoal/30 px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-charcoal transition hover:border-charcoal"
              >
                Services & Prices
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gold" /> Walk-ins welcome
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> 9 Woodthorpe Road, TW15 2RL
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" /> Open 7 days a week
              </span>
            </div>
          </div>

          <div className="md:col-span-6 md:-mr-10">
            <div className="relative h-[58vh] min-h-[32rem] overflow-hidden md:h-[70vh] md:max-h-[760px]">
              <img
                src={storefrontAsset.url}
                alt="Lux & Glow Barber and Unisex Salon storefront in Ashford"
                className="h-full w-full object-cover object-center shadow-luxe"
                width={768}
                height={1024}
              />
              <div className="absolute -bottom-6 -left-6 hidden bg-ivory p-6 shadow-luxe md:block">
                <p className="eyebrow">The Glow Circle</p>
                <p className="mt-2 max-w-[12rem] font-display text-lg leading-tight text-charcoal">
                  Member rituals, monthly grooming gifts & priority booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-charcoal">
        <div className="grid md:grid-cols-2">
          <img
            src={interiorAsset.url}
            alt="Styling chairs inside Lux & Glow salon"
            loading="lazy"
            className="h-[28rem] w-full object-cover md:h-[36rem]"
          />
          <div className="flex items-center px-7 py-14 md:px-16">
            <div className="max-w-lg">
              <span className="text-[11px] uppercase tracking-[0.2em] text-champagne">
                Inside Lux & Glow
              </span>
              <h2 className="mt-5 font-display text-3xl text-ivory md:text-5xl">
                Bright, welcoming and made for every ritual.
              </h2>
              <p className="mt-6 leading-relaxed text-ivory/70">
                From precision barbering and colour to Japanese head spa, nails and beauty
                treatments, our Ashford salon brings every service under one roof.
              </p>
              <Link
                to="/gallery"
                className="mt-8 inline-block border-b border-champagne pb-1 text-[11px] uppercase tracking-[0.2em] text-champagne"
              >
                Explore the salon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-y border-border bg-cream/60">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="gold-rule" /> <span className="eyebrow">Services</span>
              </div>
              <h2 className="mt-5 font-display text-3xl text-charcoal md:text-5xl">
                Curated grooming, end to end.
              </h2>
            </div>
            <Link to="/services" className="eyebrow text-charcoal hover:text-gold">
              View full menu →
            </Link>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((s) => (
              <article
                key={s.id}
                className="group bg-card shadow-soft transition hover:shadow-luxe"
              >
                <div className="overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="eyebrow">
                    {s.category} · {s.duration}
                  </p>
                  <h3 className="font-display text-xl text-charcoal">{s.name}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-display text-lg text-charcoal">£{s.price}</span>
                    <Link
                      to="/booking"
                      className="text-[11px] tracking-[0.2em] uppercase text-gold hover:underline"
                    >
                      Reserve
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="eyebrow">Why {SALON_CONFIG.name}</span>
            <h2 className="mt-4 font-display text-3xl text-charcoal md:text-5xl">
              A standard reserved for the few.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Every chair is led by a qualified stylist or barber with years of experience. Each
              appointment is unhurried, private and tailored — from the consultation to the final
              finishing oil.
            </p>
          </div>
          <div className="grid gap-8 md:col-span-7 sm:grid-cols-2">
            {[
              { i: Award, t: "Master craftsmen", d: "British Master Barbers Alliance certified." },
              {
                i: Sparkles,
                t: "Heritage rituals",
                d: "Hot towels, hand-blended oils, single-blade shaves.",
              },
              {
                i: Clock,
                t: "Unhurried by design",
                d: "Generous appointment windows, never overbooked.",
              },
              {
                i: Star,
                t: "Members first",
                d: "The Glow Circle: priority chairs and quiet perks.",
              },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="border-l border-champagne/50 pl-5">
                <Icon className="h-5 w-5 text-gold" />
                <h3 className="mt-3 font-display text-lg text-charcoal">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section className="border-y border-border bg-ivory">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="flex items-center gap-3">
            <span className="gold-rule" />
            <span className="eyebrow">Studio</span>
          </div>
          <h2 className="mt-4 font-display text-3xl text-charcoal md:text-5xl">
            Before, after, always considered.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {beforeAfter.map((b) => (
              <div key={b.name} className="overflow-hidden bg-card shadow-soft">
                <div className="grid grid-cols-2">
                  <img
                    src={b.before}
                    alt="before"
                    loading="lazy"
                    className="aspect-square object-cover"
                  />
                  <img
                    src={b.after}
                    alt="after"
                    loading="lazy"
                    className="aspect-square object-cover"
                  />
                </div>
                <div className="flex items-center justify-between p-5">
                  <p className="font-display text-lg text-charcoal">{b.name}</p>
                  <span className="eyebrow">Before / After</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="border-t border-champagne/60 pt-8">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 font-serif text-xl leading-snug text-charcoal italic">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6">
                <p className="text-sm font-medium text-charcoal">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="bg-cream/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
          <div className="flex items-end justify-between">
            <div>
              <span className="eyebrow">Instagram</span>
              <h2 className="mt-3 font-display text-2xl text-charcoal md:text-4xl">
                {SALON_CONFIG.social.instagram}
              </h2>
            </div>
            <a className="hidden eyebrow text-charcoal hover:text-gold md:block" href="#">
              Follow →
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-4">
            {[interiorAsset.url, windowAsset.url, ...instagramFeed].slice(0, 6).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={i < 2 ? "Inside Lux & Glow salon" : "Lux & Glow salon work"}
                loading="lazy"
                className="aspect-square object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + BOOKING */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="bg-cream p-10 md:p-14">
            <span className="eyebrow">The menu</span>
            <h2 className="mt-4 font-display text-3xl text-charcoal md:text-4xl">
              Treatments, clearly priced.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Browse the full treatment menu, including Japanese head spa, facials, waxing,
              manicures and pedicures.
            </p>
            <Link
              to="/services"
              className="mt-8 inline-block rounded-full bg-charcoal px-6 py-3 text-[11px] tracking-[0.2em] uppercase text-ivory"
            >
              View services
            </Link>
          </div>
          <div className="bg-charcoal p-10 text-ivory md:p-14">
            <span className="text-[11px] uppercase tracking-[0.2em] text-champagne">
              Book online
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              Choose your treatment and time.
            </h2>
            <p className="mt-4 max-w-md text-ivory/75">
              Create an account to see live availability, confirm your visit and manage it from your
              dashboard.
            </p>
            <Link
              to="/booking"
              className="mt-8 inline-block rounded-full border border-champagne px-6 py-3 text-[11px] tracking-[0.2em] uppercase text-champagne"
            >
              Book an appointment
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <span className="eyebrow">Visit</span>
              <h2 className="mt-4 font-display text-3xl text-charcoal md:text-5xl">
                The chair is yours.
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground">
                Reserve online in under a minute, or speak with our concierge for wedding, group and
                bespoke bookings.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/booking"
                  className="rounded-full bg-charcoal px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-ivory hover:opacity-90"
                >
                  Reserve Online
                </Link>
                <a
                  href={`tel:${SALON_CONFIG.phone}`}
                  className="rounded-full border border-charcoal/30 px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-charcoal hover:border-charcoal"
                >
                  {SALON_CONFIG.phone}
                </a>
              </div>
            </div>
            <div className="bg-card p-8 shadow-soft md:p-10">
              <p className="eyebrow">House Hours</p>
              <ul className="mt-5 space-y-3">
                {SALON_CONFIG.hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between border-b border-border pb-3 text-sm"
                  >
                    <span className="font-medium text-charcoal">{h.day}</span>
                    <span className="text-muted-foreground">{h.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">{SALON_CONFIG.address}</p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
