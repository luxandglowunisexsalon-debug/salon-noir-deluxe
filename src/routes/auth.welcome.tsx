import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, Crown, Gift } from "lucide-react";
import { AuthShell, PrimaryButton } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/welcome")({
  head: () => ({ meta: [{ title: "Welcome — Hawthorne & Vale" }] }),
  component: Welcome,
});

function Welcome() {
  const { session } = useAuth();
  const name = session?.profile.full_name?.split(" ")[0] || "Gentleman";

  return (
    <AuthShell eyebrow="Membership Confirmed" title={`Welcome, ${name}.`} subtitle="Your seat at Hawthorne & Vale is reserved. Below is what's waiting inside.">
      <div className="space-y-3">
        {[
          { icon: Crown, title: "Vale Circle — Oak tier", text: "Earn 5 points for every £1 spent in house." },
          { icon: Sparkles, title: "Priority booking", text: "Reserve with your favoured master barber 14 days ahead." },
          { icon: Gift, title: "First-visit gift", text: "Complimentary hot-towel ritual on your inaugural appointment." },
        ].map((b) => (
          <div key={b.title} className="flex items-start gap-4 rounded border border-border bg-cream/40 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-charcoal text-ivory">
              <b.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-charcoal">{b.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{b.text}</p>
            </div>
            <Check className="ml-auto h-4 w-4 text-champagne-deep" />
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/dashboard"><PrimaryButton type="button">Enter the Members' Lounge</PrimaryButton></Link>
        <Link to="/booking" className="grid place-items-center rounded-full border border-charcoal px-6 py-3.5 text-[12px] tracking-[0.25em] uppercase text-charcoal transition hover:bg-charcoal hover:text-ivory">
          Book first visit
        </Link>
      </div>
    </AuthShell>
  );
}
