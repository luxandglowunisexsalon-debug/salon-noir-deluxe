// Supabase-ready data models (mock now, persisted later)
export type Role = "admin" | "customer";

export type Permission =
  | "bookings.read" | "bookings.write"
  | "customers.read" | "customers.write"
  | "reviews.moderate"
  | "settings.write"
  | "admins.invite";

export interface User {
  user_id: string;
  email: string;
  role: Role;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  user_id: string;
  full_name: string;
  phone: string;
  avatar_initial: string;
  created_at: string;
  updated_at: string;
}

export interface Customer extends Profile {
  preferred_services: string[];
  preferred_stylist: string | null;
  marketing_opt_in: boolean;
  loyalty_tier: "Shine" | "Radiance" | "Champagne" | "Lux";
  loyalty_points: number;
}

export interface Admin extends Profile {
  access_level: "Owner" | "Manager" | "Front Desk";
  permissions: Permission[];
  invited_by: string | null;
  status: "active" | "invited" | "suspended";
}

export interface BookingCustomer {
  booking_id: string;
  customer_id: string;
  service_id: string;
  stylist_id: string;
  scheduled_at: string;
  status: "confirmed" | "completed" | "cancelled";
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "bookings.read", "bookings.write",
    "customers.read", "customers.write",
    "reviews.moderate", "settings.write", "admins.invite",
  ],
  customer: [],
};

export const ACCESS_LEVELS = [
  { level: "Owner", description: "Full house access — settings, finance, admin invites", permissions: 7 },
  { level: "Manager", description: "Bookings, customers, reviews, promotions", permissions: 5 },
  { level: "Front Desk", description: "Bookings and customer check-in only", permissions: 2 },
] as const;
