import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { SALON_CONFIG } from "@/lib/salon-config";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import storefrontAsset from "@/assets/lux-glow-storefront.jpeg.asset.json";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact & Find Us — ${SALON_CONFIG.name}, Ashford TW15` },
      { name: "description", content: `Call Lux & Glow on 01784 392 898 or visit 9 Woodthorpe Road, Ashford TW15 2RL. Opening hours seven days a week.` },
    ],
    links: [{ rel: "canonical", href: "https://noble-manor-haven.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-10 md:px-10 md:pt-24">
        <span className="eyebrow">Visit</span>
        <h1 className="mt-4 font-display text-4xl text-charcoal md:text-6xl">In Ashford, at your service.</h1>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 md:grid-cols-2 md:px-10">
        <div className="space-y-5">
          {[
            { I: MapPin, k: "Address", v: SALON_CONFIG.address },
            { I: Phone, k: "Telephone", v: SALON_CONFIG.phone },
            { I: MessageCircle, k: "WhatsApp", v: SALON_CONFIG.whatsapp },
            { I: Mail, k: "Email", v: SALON_CONFIG.email },
          ].map(({ I, k, v }) => (
            <div key={k} className="flex items-start gap-5 border-b border-border pb-5">
              <I className="mt-1 h-5 w-5 text-gold" />
              <div>
                <p className="eyebrow">{k}</p>
                <p className="mt-1 text-charcoal">{v}</p>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <p className="eyebrow">Hours</p>
            <ul className="mt-3 space-y-2 text-sm">
              {SALON_CONFIG.hours.map((h) => (
                <li key={h.day} className="flex justify-between border-b border-border pb-2">
                  <span className="text-charcoal">{h.day}</span>
                  <span className="text-muted-foreground">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form className="bg-cream p-8 md:p-10" onSubmit={(e) => { e.preventDefault(); alert("Thank you. Our concierge will be in touch shortly."); }}>
          <p className="eyebrow">Concierge enquiry</p>
          <h2 className="mt-3 font-display text-2xl text-charcoal">Speak with us</h2>
          <div className="mt-6 grid gap-4">
            <input required placeholder="Full name" className="border border-border bg-ivory px-4 py-3 text-sm outline-none focus:border-charcoal" />
            <input required type="email" placeholder="Email address" className="border border-border bg-ivory px-4 py-3 text-sm outline-none focus:border-charcoal" />
            <input placeholder="Telephone" className="border border-border bg-ivory px-4 py-3 text-sm outline-none focus:border-charcoal" />
            <textarea required rows={5} placeholder="How may we assist?" className="border border-border bg-ivory px-4 py-3 text-sm outline-none focus:border-charcoal" />
            <button className="mt-2 rounded-full bg-charcoal py-3.5 text-[12px] tracking-[0.2em] uppercase text-ivory hover:opacity-90">
              Send Enquiry
            </button>
          </div>
        </form>
      </section>
      <section className="border-y border-border">
        <img src={storefrontAsset.url} alt="Lux & Glow storefront in Ashford" loading="lazy" className="h-[55vh] min-h-[28rem] w-full object-cover object-center" />
      </section>
    </SiteShell>
  );
}
