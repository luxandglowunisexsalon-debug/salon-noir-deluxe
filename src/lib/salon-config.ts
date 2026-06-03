// Global salon configuration — all editable from Admin → Settings.
// Single source of truth for {{SALON_NAME}} and brand info.

export const SALON_CONFIG = {
  name: "Hawthorne & Vale",
  tagline: "London's House of Gentlemen's Grooming",
  logoMark: "H&V",
  established: "Est. 2014",
  address: "12 Mount Street, Mayfair, London W1K 2RD",
  phone: "+44 20 7493 0084",
  whatsapp: "+44 7700 900123",
  email: "concierge@hawthorneandvale.co.uk",
  hours: [
    { day: "Mon – Fri", time: "9:00 – 20:00" },
    { day: "Saturday", time: "8:00 – 19:00" },
    { day: "Sunday", time: "10:00 – 17:00" },
  ],
  social: {
    instagram: "@hawthorneandvale",
    facebook: "hawthorneandvale",
    tiktok: "@hawthornevale",
  },
  seo: {
    title: "Hawthorne & Vale — Mayfair Gentlemen's Salon",
    description:
      "A Mayfair house of grooming for the modern gentleman. Master cuts, hot-towel shaves, wedding grooming and member-only rituals.",
  },
  googleBusiness: "https://g.page/hawthorneandvale",
  loyalty: {
    name: "The Vale Circle",
    pointsPerPound: 5,
    tiers: [
      { name: "Oak", min: 0, perk: "5% off retail" },
      { name: "Brass", min: 500, perk: "Complimentary hot towel + 10% off" },
      { name: "Champagne", min: 1500, perk: "Priority booking, monthly grooming gift" },
      { name: "Vale", min: 4000, perk: "Private suite, dedicated master barber, 20% off" },
    ],
  },
  discounts: {
    welcome: { code: "WELCOME15", value: "15% off your first visit" },
    referral: { code: "REFER25", value: "£25 credit for you & a friend" },
  },
};

export type SalonConfig = typeof SALON_CONFIG;
