import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, PrimaryButton } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/logout")({
  head: () => ({ meta: [{ title: "Sign Out — Lux & Glow" }] }),
  component: LogoutPage,
});

function LogoutPage() {
  const { signOut, session } = useAuth();
  const nav = useNavigate();
  const [done, setDone] = useState(false);

  function confirm() {
    signOut();
    setDone(true);
    setTimeout(() => nav({ to: "/" }), 1400);
  }

  if (done) {
    return (
      <AuthShell eyebrow="Until Next Time" title="You've signed out.">
        <p className="text-sm text-muted-foreground">Returning you to the house…</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Sign Out"
      title="Leaving the lounge?"
      subtitle={session ? `You're currently signed in as ${session.profile.full_name}.` : "You aren't signed in."}
    >
      <div className="space-y-4">
        <PrimaryButton type="button" onClick={confirm}>Confirm sign out</PrimaryButton>
        <Link to="/dashboard" className="block text-center text-[12px] tracking-[0.2em] uppercase text-muted-foreground hover:text-charcoal">
          Stay signed in
        </Link>
      </div>
    </AuthShell>
  );
}
