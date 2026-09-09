import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, UserRound } from "lucide-react";
import { useState } from "react";
import { SALON_CONFIG } from "@/lib/salon-config";
import { useAuth } from "@/lib/auth-context";
import logoAsset from "@/assets/lux-glow-logo.jpeg.asset.json";

const nav = [
  { to: "/", label: "House" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Visit" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { isAuthenticated, role, session } = useAuth();
  const initial = session?.profile.full_name?.[0] || "G";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-ivory/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
        <Link to="/" className="flex items-center" aria-label={`${SALON_CONFIG.name} home`}>
          <img
            src={logoAsset.url}
            alt="Lux & Glow Unisex Salon"
            className="h-10 w-auto object-contain md:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`text-[11px] tracking-[0.2em] uppercase transition-colors ${
                  active ? "text-charcoal" : "text-muted-foreground hover:text-charcoal"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to={role === "admin" ? "/admin" : "/dashboard"}
              className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal hover:text-champagne-deep"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-charcoal font-display text-xs text-ivory">
                {initial}
              </span>
              {role === "admin" ? "Console" : "My Lounge"}
            </Link>
          ) : (
            <Link
              to="/auth/login"
              className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-charcoal"
            >
              <UserRound className="h-3.5 w-3.5" /> Sign in
            </Link>
          )}
          <Link
            to="/booking"
            className="rounded-full border border-charcoal bg-charcoal px-5 py-2.5 text-[12px] tracking-[0.2em] uppercase text-ivory transition hover:bg-transparent hover:text-charcoal"
          >
            Reserve
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-charcoal"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-ivory lg:hidden">
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
            {isAuthenticated ? (
              <>
                <Link
                  to={role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm tracking-[0.2em] uppercase text-charcoal"
                >
                  {role === "admin" ? "Admin Console" : "Members' Lounge"}
                </Link>
                <Link
                  to="/auth/logout"
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm tracking-[0.2em] uppercase text-muted-foreground"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm tracking-[0.2em] uppercase text-charcoal"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm tracking-[0.2em] uppercase text-muted-foreground"
                >
                  Create account
                </Link>
              </>
            )}
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
