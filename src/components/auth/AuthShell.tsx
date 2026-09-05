import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SALON_CONFIG } from "@/lib/salon-config";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        {/* Brand side */}
        <aside className="relative hidden overflow-hidden bg-charcoal text-ivory lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 10%, rgba(212,175,108,0.35), transparent 50%), radial-gradient(circle at 80% 80%, rgba(212,175,108,0.18), transparent 55%)",
            }}
          />
          <div className="relative flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-champagne/50 font-display text-sm">
              {SALON_CONFIG.logoMark}
            </span>
            <span className="font-display text-lg tracking-tight">{SALON_CONFIG.name}</span>
          </div>

          <div className="relative max-w-md">
            <p className="eyebrow text-champagne">{SALON_CONFIG.established}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight">
              A modern barber and unisex salon, for everyone who notices the details.
            </h2>
            <div className="mt-6 h-px w-14 bg-gradient-to-r from-champagne to-transparent" />
            <p className="mt-6 font-serif text-lg italic text-ivory/80">
              "Ashford’s friendliest barber and beauty salon, on Woodthorpe Road."
            </p>
            <p className="mt-2 text-xs tracking-[0.2em] uppercase text-ivory/50">
              — Local favourite, TW15
            </p>
          </div>

          <div className="relative text-xs tracking-[0.2em] uppercase text-ivory/50">
            {SALON_CONFIG.address}
          </div>
        </aside>

        {/* Form side */}
        <main className="flex flex-col">
          <header className="flex items-center justify-between px-6 py-5 lg:px-12">
            <Link to="/" className="flex items-center gap-2 text-charcoal lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-champagne/60 font-display text-sm">
                {SALON_CONFIG.logoMark}
              </span>
              <span className="font-display text-sm">{SALON_CONFIG.name}</span>
            </Link>
            <Link
              to="/"
              className="ml-auto text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-charcoal"
            >
              ← Return to House
            </Link>
          </header>

          <div className="flex flex-1 items-center justify-center px-6 pb-12 lg:px-12">
            <div className="w-full max-w-md">
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="mt-3 font-display text-3xl text-charcoal md:text-4xl">{title}</h1>
              {subtitle && <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>}
              <div className="gold-rule my-7" />
              {children}
              {footer && <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">{footer}</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function Field({
  label, type = "text", value, onChange, placeholder, required, autoComplete,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm text-charcoal outline-none transition placeholder:text-muted-foreground/60 focus:border-charcoal"
      />
    </label>
  );
}

export function PrimaryButton({
  children, loading, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className="group relative w-full overflow-hidden rounded-full bg-charcoal px-6 py-3.5 text-[12px] tracking-[0.25em] uppercase text-ivory transition disabled:opacity-60"
    >
      <span className="relative">{loading ? "Please wait…" : children}</span>
    </button>
  );
}
