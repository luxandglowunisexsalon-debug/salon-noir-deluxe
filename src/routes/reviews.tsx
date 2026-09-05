import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import { reviewStats, fullReviews, videoReviews } from "@/lib/mock-data-extended";
import { Star, PlayCircle, Quote } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: `Customer Reviews — ${SALON_CONFIG.name}, Ashford TW15` },
      { name: "description", content: "Read what clients say about Lux & Glow barber and unisex salon in Ashford." },
      { property: "og:title", content: `Customer Reviews — ${SALON_CONFIG.name}, Ashford TW15` },
      { property: "og:description", content: "Honest reviews from our Ashford clients — cuts, colour, beards and beauty." },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/reviews" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const featured = fullReviews.filter((r) => r.featured);
  const rest = fullReviews.filter((r) => !r.featured);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-12 md:px-10 md:pt-24">
        <div className="flex items-center gap-3"><span className="gold-rule" /><span className="eyebrow">Reviews</span></div>
        <h1 className="mt-5 max-w-3xl font-display text-4xl text-charcoal md:text-6xl">
          Quietly held to a higher standard.
        </h1>

        {/* Summary */}
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="bg-cream p-8">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-6xl text-charcoal">{reviewStats.average}</span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>
              <div className="mt-3 flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Based on {reviewStats.total.toLocaleString()} verified reviews.
              </p>
            </div>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow">Distribution</p>
            <ul className="mt-5 space-y-3">
              {reviewStats.distribution.map((d) => (
                <li key={d.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-3 text-charcoal">{d.stars}</span>
                  <Star className="h-3 w-3 fill-current text-gold" />
                  <div className="h-1.5 flex-1 bg-border">
                    <div className="h-full bg-charcoal" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-muted-foreground">{d.pct}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow">Across the web</p>
            <ul className="mt-5 space-y-3">
              {reviewStats.sources.map((s) => (
                <li key={s.name} className="flex items-center justify-between border-b border-border pb-3 text-sm">
                  <span className="font-medium text-charcoal">{s.name}</span>
                  <span className="text-muted-foreground">
                    <span className="text-gold">★</span> {s.rating} · {s.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-cream/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
          <span className="eyebrow">Featured</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal md:text-5xl">In their own words.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((r) => (
              <figure key={r.name} className="relative bg-ivory p-8 shadow-soft">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-champagne/40" />
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <blockquote className="mt-5 font-serif text-xl leading-snug text-charcoal italic">"{r.quote}"</blockquote>
                <figcaption className="mt-7 border-t border-border pt-5">
                  <p className="font-medium text-charcoal">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                  <p className="mt-2 text-[11px] tracking-[0.18em] uppercase text-gold">{r.service} · {r.date}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Video reviews */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <span className="eyebrow">Video</span>
        <h2 className="mt-3 font-display text-3xl text-charcoal md:text-5xl">Hear from our clients.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {videoReviews.map((v) => (
            <button key={v.id} className="group relative overflow-hidden bg-charcoal text-left">
              <img src={v.thumb} alt={v.title} className="aspect-[4/5] w-full object-cover opacity-80 transition group-hover:scale-[1.03] group-hover:opacity-100" />
              <div className="absolute inset-0 grid place-items-center">
                <PlayCircle className="h-16 w-16 text-ivory/90 transition group-hover:scale-110 group-hover:text-champagne" strokeWidth={1} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent p-5 text-ivory">
                <p className="text-[10px] tracking-[0.2em] uppercase text-champagne">{v.duration} · {v.name}</p>
                <p className="mt-1 font-display text-lg">{v.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* All reviews */}
      <section className="bg-cream/40 border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-24">
          <span className="eyebrow">All Reviews</span>
          <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
            {[...featured, ...rest].map((r) => (
              <article key={r.name + r.date} className="bg-ivory p-7">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                  <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">{r.date}</span>
                </div>
                <p className="mt-4 font-serif text-lg italic text-charcoal">"{r.quote}"</p>
                <p className="mt-5 text-sm font-medium text-charcoal">{r.name}<span className="ml-2 text-xs font-normal text-muted-foreground">· {r.service}</span></p>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/booking" className="rounded-full bg-charcoal px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-ivory hover:opacity-90">
              Reserve & experience
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
