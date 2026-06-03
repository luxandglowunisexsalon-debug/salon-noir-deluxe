import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SALON_CONFIG } from "@/lib/salon-config";

const nav = [
  { to: "/", label: "House" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "Heritage" },
  { to: "/contact", label: "Visit" },
  { to: "/dashboard", label: "Members" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-ivory/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-champagne/60 font-display text-sm text-charcoal">
            {SALON_CONFIG.logoMark}
          </span>
          <span className="hidden font-display text-lg leading-none tracking-tight text-charcoal sm:block">
            {SALON_CONFIG.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`text-[13px] tracking-[0.2em] uppercase transition-colors ${
                  active ? "text-charcoal" : "text-muted-foreground hover:text-charcoal"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin"
            className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-charcoal"
          >
            Admin
          </Link>
          <Link
            to="/booking"
            className="rounded-full border border-charcoal bg-charcoal px-5 py-2.5 text-[12px] tracking-[0.2em] uppercase text-ivory transition hover:bg-transparent hover:text-charcoal"
          >
            Reserve
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-charcoal"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-ivory md:hidden">
          <div className="flex flex-col px-5 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm tracking-[0.2em] uppercase text-charcoal"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="py-3 text-sm tracking-[0.2em] uppercase text-muted-foreground"
            >
              Admin
            </Link>
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-charcoal py-3 text-center text-sm tracking-[0.2em] uppercase text-ivory"
            >
              Reserve
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
