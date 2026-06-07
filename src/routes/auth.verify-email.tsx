import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AuthShell, PrimaryButton } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/verify-email")({
  head: () => ({ meta: [{ title: "Verify Email — Hawthorne & Vale" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const { verifyEmail, session } = useAuth();
  const nav = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setAt(i: number, v: string) {
    const clean = v.replace(/\D/g, "").slice(-1);
    const next = [...digits]; next[i] = clean; setDigits(next);
    if (clean && i < 5) refs.current[i + 1]?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    await verifyEmail(digits.join(""));
    setLoading(false);
    nav({ to: "/auth/welcome" });
  }

  return (
    <AuthShell
      eyebrow="Email Verification"
      title="Confirm your email."
      subtitle={`We've sent a six-digit code to ${session?.user.email ?? "your inbox"}. Enter it below to activate your membership.`}
    >
      <form onSubmit={submit} className="space-y-6">
        <div className="flex gap-2 sm:gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-full rounded border border-border bg-card text-center font-display text-2xl text-charcoal outline-none focus:border-charcoal focus:ring-2 focus:ring-champagne/40"
            />
          ))}
        </div>

        <PrimaryButton loading={loading}>Verify &amp; continue</PrimaryButton>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Didn't receive it?</span>
          <button type="button" className="text-charcoal hover:underline">Resend code</button>
        </div>
      </form>
    </AuthShell>
  );
}
