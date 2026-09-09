import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } =>
    typeof s.redirect === "string" ? { redirect: s.redirect } : {},
  head: () => ({ meta: [{ title: "Sign In — Lux & Glow Barber & Unisex Salon" }] }),

  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const s = await signIn(email, password);
      const dest = search.redirect || (s.user.role === "admin" ? "/admin" : "/dashboard");
      navigate({ to: dest });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Member Entrance"
      title="Welcome back."
      subtitle="Sign in to book appointments and manage your salon visits."
      footer={
        <p>
          Need an account?{" "}
          <Link to="/auth/register" className="text-charcoal underline-offset-4 hover:underline">
            Create one →
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          required
          placeholder="you@domain.com"
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          required
          placeholder="••••••••"
        />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="h-3.5 w-3.5 accent-charcoal" /> Remember me
          </label>
          <Link to="/auth/forgot-password" className="text-charcoal hover:underline">
            Forgot password?
          </Link>
        </div>
        {err && (
          <p className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {err}
          </p>
        )}
        <PrimaryButton loading={loading}>Sign in</PrimaryButton>
      </form>
    </AuthShell>
  );
}
