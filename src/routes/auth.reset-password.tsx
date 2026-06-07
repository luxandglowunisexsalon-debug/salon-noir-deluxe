import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "New Password — Hawthorne & Vale" }] }),
  component: ResetPage,
});

function ResetPage() {
  const { resetPassword } = useAuth();
  const nav = useNavigate();
  const [p1, setP1] = useState(""); const [p2, setP2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    if (p1.length < 8) return setErr("Password must be at least 8 characters.");
    if (p1 !== p2) return setErr("Passwords don't match.");
    setLoading(true);
    await resetPassword(p1);
    setLoading(false);
    nav({ to: "/auth/login" });
  }

  const strength = Math.min(4, Math.floor(p1.length / 3));

  return (
    <AuthShell
      eyebrow="Restore Access"
      title="Set a new password."
      subtitle="Choose something memorable. We recommend a passphrase of three unrelated words."
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label="New password" type="password" value={p1} onChange={setP1} required autoComplete="new-password" />
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i < strength ? "bg-champagne-deep" : "bg-border"}`} />
          ))}
        </div>
        <Field label="Confirm password" type="password" value={p2} onChange={setP2} required autoComplete="new-password" />
        {err && <p className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{err}</p>}
        <PrimaryButton loading={loading}>Update password</PrimaryButton>
      </form>
    </AuthShell>
  );
}
