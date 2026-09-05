import { Link } from "@tanstack/react-router";
import { SALON_CONFIG } from "@/lib/salon-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="font-display text-2xl text-charcoal">{SALON_CONFIG.name}</div>
          <p className="mt-2 text-sm text-muted-foreground">{SALON_CONFIG.tagline}</p>
          <div className="gold-rule mt-6" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {SALON_CONFIG.address}
          </p>
        </div>

        <div>
          <p className="eyebrow">House</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-charcoal text-muted-foreground">Services</Link></li>
            <li><Link to="/pricing" className="hover:text-charcoal text-muted-foreground">Pricing</Link></li>
            <li><Link to="/gallery" className="hover:text-charcoal text-muted-foreground">Gallery</Link></li>
            <li><Link to="/reviews" className="hover:text-charcoal text-muted-foreground">Reviews</Link></li>
            <li><Link to="/blog" className="hover:text-charcoal text-muted-foreground">Journal</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Concierge</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/loyalty" className="hover:text-charcoal">The Glow Circle</Link></li>
            <li><Link to="/promotions" className="hover:text-charcoal">Offers</Link></li>
            <li><Link to="/contact" className="hover:text-charcoal">Visit</Link></li>
            <li className="pt-3 text-charcoal">{SALON_CONFIG.phone}</li>
            <li>{SALON_CONFIG.email}</li>
            <li>WhatsApp {SALON_CONFIG.whatsapp}</li>
            <li className="pt-2 text-charcoal">{SALON_CONFIG.social.instagram}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:px-10">
          <span>© {new Date().getFullYear()} {SALON_CONFIG.name}. {SALON_CONFIG.established}.</span>
          <span className="tracking-[0.2em] uppercase">Ashford · TW15 2RL</span>
        </div>
      </div>
    </footer>
  );
}
