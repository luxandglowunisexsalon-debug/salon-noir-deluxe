import { useEffect, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/auth-types";

export function ProtectedRoute({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { isAuthenticated, role: currentRole, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate({ to: "/auth/login", search: { redirect: pathname, role } as any });
    } else if (currentRole !== role) {
      navigate({ to: role === "admin" ? "/auth/login" : "/dashboard", search: { role } as any });
    }
  }, [loading, isAuthenticated, currentRole, role, navigate, pathname]);

  if (loading || !isAuthenticated || currentRole !== role) {
    return (
      <div className="grid min-h-screen place-items-center bg-ivory">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-champagne border-t-transparent" />
          <p className="eyebrow mt-5">Verifying your access</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
