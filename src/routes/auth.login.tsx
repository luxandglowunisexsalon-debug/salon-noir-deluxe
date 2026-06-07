import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/auth-types";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
    role: (s.role === "admin" ? "admin" : "customer") as Role,
  }),
  head: () => ({ meta: [{ title: "Sign In — Hawthorne & Vale" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/login" });
  const [role, setRole] = useState<Role>(search.role);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await signIn(email, password, role);
      navigate({ to: search.redirect || (role === "admin" ? "/admin" : "/dashboard") });
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <AuthShell
      eyebrow="Member Entrance"
      title="Welcome back."
      subtitle="Sign in to manage appointments, loyalty rewards and your house preferences."
      footer={
        <p>
          New to the house?{" "}
          <Link to="/auth/register" className="text-charcoal underline-offset-4 hover:underline">Request membership →</Link>
        </p>
      }
    >
      <div className="mb-6 inline-flex rounded-full border border-border bg-cream p-1 text-[11px] tracking-[0.2em] uppercase">
        {(["customer", "admin"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`rounded-full px-4 py-2 transition ${role === r ? "bg-charcoal text-ivory" : "text-muted-foreground"}`}
          >
            {r === "customer" ? "Member" : "House Admin"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Field label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} required placeholder="you@domain.com" />
        <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={setPassword} required placeholder="••••••••" />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="h-3.5 w-3.5 accent-charcoal" /> Remember me
          </label>
          <Link to="/auth/forgot-password" className="text-charcoal hover:underline">Forgot password?</Link>
        </div>
        {err && <p className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{err}</p>}
        <PrimaryButton loading={loading}>{role === "admin" ? "Enter Admin Console" : "Enter Members' Lounge"}</PrimaryButton>
      </form>

      <div className="mt-6 rounded border border-dashed border-champagne/50 bg-cream/50 px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
        <p className="eyebrow mb-1">Demo credentials</p>
        Member · member@hawthorneandvale.co.uk / member123<br />
        Admin · admin@hawthorneandvale.co.uk / admin123
      </div>
    </AuthShell>
  );
}
