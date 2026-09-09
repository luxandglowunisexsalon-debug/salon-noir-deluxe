import { Link } from "@tanstack/react-router";
import { SALON_CONFIG } from "@/lib/salon-config";
import logoAsset from "@/assets/lux-glow-logo.jpeg.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <img
            src={logoAsset.url}
            alt="Lux & Glow Unisex Salon"
            className="h-16 w-auto object-contain"
            loading="lazy"
          />
          <p className="mt-2 text-sm text-muted-foreground">{SALON_CONFIG.tagline}</p>
          <div className="gold-rule mt-6" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {SALON_CONFIG.address}
          </p>
        </div>

        <div>
          <p className="eyebrow">House</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/services" className="hover:text-charcoal text-muted-foreground">
                Services
              </Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-charcoal text-muted-foreground">
                Book online
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-charcoal text-muted-foreground">
                Visit
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Concierge</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/contact" className="hover:text-charcoal">
                Visit
              </Link>
            </li>
            <li className="pt-3 text-charcoal">{SALON_CONFIG.phone}</li>
            <li>{SALON_CONFIG.email}</li>
            <li>WhatsApp {SALON_CONFIG.whatsapp}</li>
            <li className="pt-2 text-charcoal">{SALON_CONFIG.social.instagram}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:px-10">
          <span>
            © {new Date().getFullYear()} {SALON_CONFIG.name}. {SALON_CONFIG.established}.
          </span>
          <span className="tracking-[0.2em] uppercase">Ashford · TW15 2RL</span>
        </div>
      </div>
    </footer>
  );
}
