import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Reset Access — Lux & Glow" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await sendPasswordReset(email);
    setLoading(false); setSent(true);
  }

  return (
    <AuthShell
      eyebrow="Reset Access"
      title={sent ? "Check your inbox." : "Forgotten your password?"}
      subtitle={
        sent
          ? `We've sent a discreet recovery link to ${email}. The link is valid for 30 minutes.`
          : "Enter your registered email and we'll send a secure link to restore access."
      }
      footer={<Link to="/auth/login" className="text-charcoal underline-offset-4 hover:underline">← Back to sign in</Link>}
    >
      {sent ? (
        <div className="space-y-5">
          <div className="rounded border border-champagne/50 bg-cream/60 p-5 text-sm text-charcoal">
            <p className="eyebrow mb-2">What happens next</p>
            <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
              <li>Open the email from concierge@hawthorneandvale.co.uk</li>
              <li>Follow the secure link inside</li>
              <li>Set a new password and return to the house</li>
            </ol>
          </div>
          <Link to="/auth/reset-password" className="block">
            <PrimaryButton type="button">Continue to reset</PrimaryButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <Field label="Registered email" type="email" value={email} onChange={setEmail} required placeholder="you@domain.com" />
          <PrimaryButton loading={loading}>Send recovery link</PrimaryButton>
        </form>
      )}
    </AuthShell>
  );
}
