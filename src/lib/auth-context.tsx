import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SupabaseClient, Session as SbSession } from "@supabase/supabase-js";
import { getBrowserSupabase } from "./supabase/browser";
import type { Customer, Role, User } from "./auth-types";

// Session shape kept compatible with earlier phases.
export interface Session {
  user: User;
  profile: Partial<Customer> & { full_name: string };
  expires_at: number;
}

interface RegisterInput {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  preferred_services?: string[];
  preferred_stylist?: string | null;
  marketing_opt_in?: boolean;
}

interface AuthCtx {
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
  signIn: (email: string, password: string, role?: Role) => Promise<Session>;
  signUp: (input: RegisterInput) => Promise<Session>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  updateProfile: (patch: Partial<Customer>) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

async function hydrate(supabase: SupabaseClient, sb: SbSession): Promise<Session> {
  const uid = sb.user.id;
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", uid),
  ]);
  const roleList = (roles ?? []).map((r: any) => r.role as string);
  const role: Role = roleList.includes("admin") || roleList.includes("super_admin") ? "admin" : "customer";
  return {
    user: {
      user_id: uid,
      email: sb.user.email ?? "",
      role,
      email_verified: !!sb.user.email_confirmed_at,
      created_at: sb.user.created_at,
      updated_at: new Date().toISOString(),
    },
    profile: {
      user_id: uid,
      full_name: profile?.full_name ?? (sb.user.user_metadata?.full_name as string) ?? "",
      phone: profile?.phone ?? "",
      preferred_services: profile?.preferred_services ?? [],
      preferred_stylist: profile?.preferred_stylist ?? null,
      marketing_opt_in: profile?.marketing_opt_in ?? false,
    },
    expires_at: (sb.expires_at ?? Math.floor(Date.now() / 1000) + 3600) * 1000,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef<SupabaseClient | null>(null);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        const supabase = await getBrowserSupabase();
        if (cancelled) return;
        clientRef.current = supabase;
        const { data } = await supabase.auth.getSession();
        if (data.session) setSession(await hydrate(supabase, data.session));
        const sub = supabase.auth.onAuthStateChange(async (_event, sb) => {
          if (!sb) setSession(null);
          else setSession(await hydrate(supabase, sb));
        });
        unsub = () => sub.data.subscription.unsubscribe();
      } catch (e) {
        console.error("Auth init failed", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  const requireClient = () => {
    if (!clientRef.current) throw new Error("Auth is still starting up. Try again in a moment.");
    return clientRef.current;
  };

  const signIn: AuthCtx["signIn"] = useCallback(async (email, password, role) => {
    const supabase = requireClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.session) throw new Error("Sign in failed.");
    const s = await hydrate(supabase, data.session);
    if (role && s.user.role !== role) {
      await supabase.auth.signOut();
      throw new Error(`This account isn't registered as a ${role}.`);
    }
    setSession(s);
    return s;
  }, []);

  const signUp: AuthCtx["signUp"] = useCallback(async (input) => {
    const supabase = requireClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/welcome`,
        data: {
          full_name: input.full_name,
          phone: input.phone,
        },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.session) {
      // Email confirmation required — no session yet
      return {
        user: {
          user_id: data.user?.id ?? "",
          email: input.email,
          role: "customer",
          email_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        profile: { user_id: data.user?.id ?? "", full_name: input.full_name, phone: input.phone },
        expires_at: 0,
      };
    }
    // Persist preferences on the profile row created by the DB trigger.
    if (data.user) {
      await supabase.from("profiles").upsert({
        user_id: data.user.id,
        full_name: input.full_name,
        phone: input.phone,
        preferred_services: input.preferred_services ?? [],
        preferred_stylist: input.preferred_stylist ?? null,
        marketing_opt_in: input.marketing_opt_in ?? false,
      });
    }
    const s = await hydrate(supabase, data.session);
    setSession(s);
    return s;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = clientRef.current;
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const supabase = requireClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw new Error(error.message);
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    const supabase = requireClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
  }, []);

  const verifyEmail = useCallback(async (_code: string) => {
    // Supabase handles verification through the email link; nothing to do here.
  }, []);

  const updateProfile: AuthCtx["updateProfile"] = useCallback(
    async (patch) => {
      const supabase = requireClient();
      if (!session) return;
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: patch.full_name,
          phone: patch.phone,
          preferred_services: patch.preferred_services,
          preferred_stylist: patch.preferred_stylist,
          marketing_opt_in: patch.marketing_opt_in,
        })
        .eq("user_id", session.user.user_id);
      if (error) throw new Error(error.message);
      setSession({ ...session, profile: { ...session.profile, ...patch } as Session["profile"] });
    },
    [session],
  );

  const value = useMemo<AuthCtx>(
    () => ({
      session,
      loading,
      isAuthenticated: !!session,
      role: session?.user.role ?? null,
      signIn,
      signUp,
      signOut,
      sendPasswordReset,
      resetPassword,
      verifyEmail,
      updateProfile,
    }),
    [session, loading, signIn, signUp, signOut, sendPasswordReset, resetPassword, verifyEmail, updateProfile],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
