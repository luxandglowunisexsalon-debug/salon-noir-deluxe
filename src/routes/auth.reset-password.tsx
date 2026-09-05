import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, PrimaryButton } from "@/components/auth/AuthShell";
import { PasswordField, isPasswordStrong } from "@/components/auth/PasswordField";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "New Password — Lux & Glow" }] }),
  component: ResetPage,
});

function ResetPage() {
  const { resetPassword } = useAuth();
  const nav = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!isPasswordStrong(p1)) return setErr("Please satisfy all password requirements.");
    if (p1 !== p2) return setErr("Passwords don't match.");
    setLoading(true);
    try {
      await resetPassword(p1);
      nav({ to: "/auth/login" });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Restore Access"
      title="Set a new password."
      subtitle="Choose something memorable. We recommend a passphrase of three unrelated words."
    >
      <form onSubmit={submit} className="space-y-5">
        <PasswordField label="New password" value={p1} onChange={setP1} required showStrength />
        <PasswordField label="Confirm password" value={p2} onChange={setP2} required autoComplete="new-password" />
        {p2 && p1 !== p2 && (
          <p className="text-[11px] text-destructive">Passwords don't match yet.</p>
        )}
        {err && <p className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{err}</p>}
        <PrimaryButton loading={loading} disabled={!isPasswordStrong(p1) || p1 !== p2}>
          Update password
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
