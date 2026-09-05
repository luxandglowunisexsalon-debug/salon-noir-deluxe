import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import { blogPosts } from "@/lib/mock-data-extended";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: `Hair & Beauty Journal — ${SALON_CONFIG.name}, Ashford` },
      { name: "description", content: "Hair, barbering and beauty advice from the Lux & Glow team in Ashford — styling, colour care, beard grooming and bridal prep." },
      { property: "og:title", content: `Hair & Beauty Journal — ${SALON_CONFIG.name}, Ashford` },
      { property: "og:description", content: "Styling tips and salon news from our Ashford barbers and stylists." },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))],
    [],
  );
  const [cat, setCat] = useState("All");

  const posts = useMemo(
    () => (cat === "All" ? blogPosts : blogPosts.filter((p) => p.category === cat)),
    [cat],
  );

  const feature = posts[0];
  const rest = posts.slice(1);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-10 md:pt-24">
        <div className="flex items-center gap-3"><span className="gold-rule" /><span className="eyebrow">The Journal</span></div>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] text-charcoal md:text-6xl">
          Editorial notes from the chair.
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          A quiet log of craft, heritage and small considered rituals — written by our master barbers and the house concierge.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition ${
                cat === c
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-border text-charcoal hover:border-charcoal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      {feature && (
        <section className="mx-auto max-w-7xl px-5 pb-16 md:px-10 md:pb-20">
          <article className="group grid items-center gap-8 md:grid-cols-12 md:gap-14">
            <div className="overflow-hidden md:col-span-7">
              <img
                src={feature.image}
                alt={feature.title}
                className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="md:col-span-5">
              <p className="text-[11px] tracking-[0.2em] uppercase text-gold">{feature.category} · {feature.readTime}</p>
              <h2 className="mt-4 font-display text-3xl text-charcoal md:text-5xl">{feature.title}</h2>
              <p className="mt-5 max-w-md text-muted-foreground">{feature.excerpt}</p>
              <p className="mt-7 text-sm text-charcoal">
                <span className="font-medium">{feature.author}</span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span className="text-muted-foreground">{feature.date}</span>
              </p>
              <button className="mt-7 inline-flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-charcoal group-hover:text-gold">
                Read the journal entry <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </section>
      )}

      {/* Grid */}
      <section className="border-t border-border bg-cream/60">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <article key={p.slug} className="group cursor-pointer">
                <div className="overflow-hidden bg-charcoal/5">
                  <img src={p.image} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                </div>
                <div className="mt-6">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-gold">{p.category} · {p.readTime}</p>
                  <h3 className="mt-3 font-display text-2xl leading-snug text-charcoal group-hover:text-gold transition">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  <p className="mt-5 text-xs text-muted-foreground">
                    <span className="text-charcoal">{p.author}</span> · {p.date}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-4xl px-5 py-20 md:px-10 md:py-28 text-center">
        <span className="eyebrow">The Quarterly</span>
        <h2 className="mt-4 font-display text-3xl text-charcoal md:text-5xl">
          A single, beautiful letter — four times a year.
        </h2>
        <p className="mt-5 text-muted-foreground">
          Heritage notes, new services and an early word on members' offers. No noise, ever.
        </p>
        <form className="mx-auto mt-9 flex max-w-lg flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="your@email.co.uk"
            className="flex-1 border border-border bg-ivory px-5 py-3.5 text-sm text-charcoal placeholder:text-muted-foreground focus:border-charcoal focus:outline-none"
          />
          <button
            type="button"
            className="rounded-none bg-charcoal px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-ivory hover:opacity-90"
          >
            Subscribe
          </button>
        </form>
      </section>
    </SiteShell>
  );
}
