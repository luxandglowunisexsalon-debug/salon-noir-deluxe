import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import { galleryCategories, galleryItems, beforeAfterPairs } from "@/lib/mock-data-extended";
import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Hair Gallery — ${SALON_CONFIG.name} Salon, Ashford` },
      { name: "description", content: "Haircuts, skin fades, colour, styling and bridal looks created at Lux & Glow in Ashford." },
      { property: "og:title", content: `Hair Gallery — ${SALON_CONFIG.name} Salon, Ashford` },
      { property: "og:description", content: "Before and after transformations from our Ashford unisex salon." },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [cat, setCat] = useState<(typeof galleryCategories)[number]>("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const items = useMemo(
    () => (cat === "All" ? galleryItems : galleryItems.filter((g) => g.category === cat)),
    [cat],
  );

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-10 md:pt-24">
        <div className="flex items-center gap-3"><span className="gold-rule" /><span className="eyebrow">Studio</span></div>
        <h1 className="mt-5 max-w-3xl font-display text-4xl text-charcoal md:text-6xl">
          A portfolio in quiet detail.
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          A curated record from our chairs and reading rooms. Filter by service or browse the full collection.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {galleryCategories.map((c) => (
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

      {/* Masonry */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10 md:pb-28">
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {items.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setLightbox(g.src)}
              className="group relative block w-full overflow-hidden bg-cream"
              style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "1/1" : "4/5" }}
            >
              <img
                src={g.src}
                alt={g.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 text-left opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-[10px] tracking-[0.2em] uppercase text-champagne">{g.category}</p>
                <p className="font-display text-base text-ivory">{g.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Before/After comparison sliders */}
      <section className="border-y border-border bg-cream/60">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="flex items-center gap-3"><span className="gold-rule" /><span className="eyebrow">Before / After</span></div>
          <h2 className="mt-4 font-display text-3xl text-charcoal md:text-5xl">Drag to see the difference.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {beforeAfterPairs.map((b) => (
              <BeforeAfter key={b.id} before={b.before} after={b.after} label={b.label} category={b.category} />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 grid place-items-center bg-charcoal/90 p-5 backdrop-blur-sm"
        >
          <button
            className="absolute right-5 top-5 text-ivory"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <img src={lightbox} alt="" className="max-h-[88vh] max-w-[92vw] object-contain shadow-luxe" />
        </div>
      )}
    </SiteShell>
  );
}

function BeforeAfter({ before, after, label, category }: { before: string; after: string; label: string; category: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  };

  return (
    <div>
      <div
        ref={ref}
        onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onClick={(e) => move(e.clientX)}
        className="relative aspect-[4/5] w-full select-none overflow-hidden bg-charcoal"
      >
        <img src={after} alt="After" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={before} alt="Before" className="h-full w-full object-cover" style={{ width: `${100 / (pos / 100)}%`, maxWidth: "none" }} />
        </div>
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="h-full w-px bg-ivory/90" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-ivory text-charcoal shadow-luxe">
            ↔
          </div>
        </div>
        <span className="absolute left-3 top-3 bg-charcoal/70 px-2 py-1 text-[10px] tracking-[0.2em] uppercase text-ivory">Before</span>
        <span className="absolute right-3 top-3 bg-ivory/85 px-2 py-1 text-[10px] tracking-[0.2em] uppercase text-charcoal">After</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-display text-lg text-charcoal">{label}</p>
        <span className="eyebrow">{category}</span>
      </div>
    </div>
  );
}
