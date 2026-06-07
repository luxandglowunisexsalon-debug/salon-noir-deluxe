import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role, User, Customer } from "./auth-types";

// ---------- Mock auth (localStorage). Swap for Supabase later. ----------
const STORAGE_KEY = "hv_auth_session_v1";
const USERS_KEY = "hv_auth_users_v1";

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

type StoredUser = RegisterInput & { user_id: string; role: Role; email_verified: boolean; created_at: string };

interface AuthCtx {
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
  signIn: (email: string, password: string, role?: Role) => Promise<Session>;
  signUp: (input: RegisterInput) => Promise<Session>;
  signOut: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  updateProfile: (patch: Partial<Customer>) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function writeUsers(list: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}
function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s: Session = JSON.parse(raw);
    if (s.expires_at < Date.now()) { localStorage.removeItem(STORAGE_KEY); return null; }
    return s;
  } catch { return null; }
}

function seedDefaults() {
  const existing = readUsers();
  if (existing.length) return;
  const seed: StoredUser[] = [
    {
      user_id: "u_admin", role: "admin", email_verified: true,
      full_name: "Edmund Hawthorne", email: "admin@hawthorneandvale.co.uk",
      phone: "+44 20 7493 0084", password: "admin123",
      created_at: new Date().toISOString(),
    },
    {
      user_id: "u_demo", role: "customer", email_verified: true,
      full_name: "James Whitmore", email: "member@hawthorneandvale.co.uk",
      phone: "+44 7700 900222", password: "member123",
      preferred_services: ["Signature Cut", "Hot Towel Shave"],
      preferred_stylist: "Marcus Vale", marketing_opt_in: true,
      created_at: new Date().toISOString(),
    },
  ];
  writeUsers(seed);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDefaults();
    setSession(readSession());
    setLoading(false);
  }, []);

  const persist = useCallback((s: Session | null) => {
    setSession(s);
    if (typeof window === "undefined") return;
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const makeSession = (u: StoredUser): Session => ({
    user: {
      user_id: u.user_id, email: u.email, role: u.role,
      email_verified: u.email_verified,
      created_at: u.created_at, updated_at: new Date().toISOString(),
    },
    profile: {
      user_id: u.user_id, full_name: u.full_name, phone: u.phone,
      preferred_services: u.preferred_services || [],
      preferred_stylist: u.preferred_stylist ?? null,
      marketing_opt_in: u.marketing_opt_in ?? false,
    },
    expires_at: Date.now() + 1000 * 60 * 60 * 24 * 7,
  });

  const signIn: AuthCtx["signIn"] = async (email, password, role) => {
    await new Promise((r) => setTimeout(r, 600));
    const users = readUsers();
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) throw new Error("Those details don't match our records.");
    if (role && u.role !== role) throw new Error(`This account isn't registered as a ${role}.`);
    const s = makeSession(u);
    persist(s);
    return s;
  };

  const signUp: AuthCtx["signUp"] = async (input) => {
    await new Promise((r) => setTimeout(r, 700));
    const users = readUsers();
    if (users.some((x) => x.email.toLowerCase() === input.email.toLowerCase()))
      throw new Error("An account with that email already exists.");
    const u: StoredUser = {
      ...input, user_id: `u_${Math.random().toString(36).slice(2, 9)}`,
      role: "customer", email_verified: false, created_at: new Date().toISOString(),
    };
    writeUsers([...users, u]);
    const s = makeSession(u);
    persist(s);
    return s;
  };

  const signOut = () => persist(null);

  const sendPasswordReset = async (_email: string) => { await new Promise((r) => setTimeout(r, 600)); };
  const resetPassword = async (_password: string) => { await new Promise((r) => setTimeout(r, 600)); };
  const verifyEmail = async (_code: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (!session) return;
    const users = readUsers().map((u) => u.user_id === session.user.user_id ? { ...u, email_verified: true } : u);
    writeUsers(users);
    persist({ ...session, user: { ...session.user, email_verified: true } });
  };
  const updateProfile: AuthCtx["updateProfile"] = (patch) => {
    if (!session) return;
    persist({ ...session, profile: { ...session.profile, ...patch } as Session["profile"] });
  };

  const value = useMemo<AuthCtx>(() => ({
    session, loading,
    isAuthenticated: !!session,
    role: session?.user.role ?? null,
    signIn, signUp, signOut, sendPasswordReset, resetPassword, verifyEmail, updateProfile,
  }), [session, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
