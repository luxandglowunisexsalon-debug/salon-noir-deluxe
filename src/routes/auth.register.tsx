import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { PasswordField, isPasswordStrong } from "@/components/auth/PasswordField";
import { useAuth } from "@/lib/auth-context";
import { services } from "@/lib/mock-data";

const STYLISTS = ["Amira Khan", "Daniel Reyes", "Sofia Lane", "No preference"];

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Join — Lux & Glow" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "",
    preferred_services: [] as string[],
    preferred_stylist: "No preference" as string,
    marketing_opt_in: true,
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleService(name: string) {
    setForm((f) => ({
      ...f,
      preferred_services: f.preferred_services.includes(name)
        ? f.preferred_services.filter((s) => s !== name)
        : [...f.preferred_services, name],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!isPasswordStrong(form.password)) {
      return setErr("Please satisfy all password requirements.");
    }
    setLoading(true);
    try {
      await signUp(form);
      navigate({ to: "/auth/verify-email" });
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <AuthShell
      eyebrow={`Step ${step} of 2`}
      title={step === 1 ? "Request your membership." : "A few preferences."}
      subtitle={
        step === 1
          ? "An account at Lux & Glow unlocks priority booking, loyalty rewards and member-only rituals."
          : "Tell us what you favour so your master barber is ready before you arrive."
      }
      footer={
        <p>
          Already a member?{" "}
          <Link to="/auth/login" className="text-charcoal underline-offset-4 hover:underline">Sign in →</Link>
        </p>
      }
    >
      <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : submit} className="space-y-5">
        {step === 1 ? (
          <>
            <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required placeholder="James Whitmore" autoComplete="name" />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required placeholder="you@domain.com" autoComplete="email" />
            <Field label="Phone (UK)" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required placeholder="+44 7700 900000" autoComplete="tel" />
            <PasswordField
              label="Password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required
              placeholder="Create a strong password"
              showStrength
            />
            <PrimaryButton type="submit" disabled={!isPasswordStrong(form.password)}>Continue</PrimaryButton>
          </>
        ) : (
          <>
            <div>
              <span className="eyebrow">Preferred services</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {services.slice(0, 8).map((s) => {
                  const active = form.preferred_services.includes(s.name);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleService(s.name)}
                      className={`rounded-full border px-3.5 py-2 text-[11px] tracking-[0.15em] uppercase transition ${
                        active ? "border-charcoal bg-charcoal text-ivory" : "border-border text-muted-foreground hover:border-charcoal"
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="eyebrow">Preferred master barber</span>
              <select
                value={form.preferred_stylist}
                onChange={(e) => setForm({ ...form, preferred_stylist: e.target.value })}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm text-charcoal outline-none focus:border-charcoal"
              >
                {STYLISTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>

            <label className="flex items-start gap-3 rounded border border-border bg-cream/50 p-4">
              <input
                type="checkbox"
                checked={form.marketing_opt_in}
                onChange={(e) => setForm({ ...form, marketing_opt_in: e.target.checked })}
                className="mt-1 h-4 w-4 accent-charcoal"
              />
              <span className="text-xs text-muted-foreground">
                Send me curated invitations, seasonal rituals and member-only events from the house.
              </span>
            </label>

            {err && <p className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{err}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="rounded-full border border-border px-5 py-3 text-[11px] tracking-[0.2em] uppercase text-charcoal">
                Back
              </button>
              <div className="flex-1"><PrimaryButton loading={loading}>Confirm membership</PrimaryButton></div>
            </div>
          </>
        )}

        <p className="pt-2 text-[11px] leading-relaxed text-muted-foreground">
          By continuing you agree to our House Etiquette and Privacy Charter.
        </p>
      </form>
    </AuthShell>
  );
}
