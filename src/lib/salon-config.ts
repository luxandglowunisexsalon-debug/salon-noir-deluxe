// Global salon configuration — all editable from Admin → Settings.
// Single source of truth for brand info.

export const SALON_CONFIG = {
  name: "Lux & Glow",
  tagline: "Barber & Unisex Salon",
  logoMark: "L&G",
  established: "Est. 2026",
  address: "9 Woodthorpe Road, Ashford, TW15 2RL",
  phone: "01784 392 898",
  whatsapp: "01784 392 898",
  email: "hello@luxandglow.co.uk",
  hours: [
    { day: "Mon – Fri", time: "10:00 – 19:00" },
    { day: "Saturday", time: "9:30 – 19:00" },
    { day: "Sunday", time: "10:00 – 18:00" },
  ],
  social: {
    instagram: "@luxandglow",
    facebook: "luxandglow",
    tiktok: "@luxandglow",
  },
  seo: {
    title: "Lux & Glow — Barber & Unisex Salon in Ashford",
    description:
      "Lux & Glow is a barber and unisex beauty salon in Ashford, TW15. Haircuts, skin fades, beard trims, colour, styling, waxing and beauty treatments for women and men. Walk-ins welcome, book online.",
    keywords:
      "Lux & Glow, unisex salon Ashford, barber Ashford, beauty salon TW15, hairdresser Ashford, ladies haircut Ashford, mens barber Woodthorpe Road",
    locality: "Ashford",
    region: "Surrey",
    postalCode: "TW15 2RL",
    streetAddress: "9 Woodthorpe Road",
    country: "GB",
  },
  googleBusiness: "https://g.page/luxandglow",
  loyalty: {
    name: "The Glow Circle",
    pointsPerPound: 5,
    tiers: [
      { name: "Shine", min: 0, perk: "5% off retail" },
      { name: "Radiance", min: 500, perk: "Complimentary finish + 10% off" },
      { name: "Champagne", min: 1500, perk: "Priority booking, monthly beauty gift" },
      { name: "Lux", min: 4000, perk: "Private suite, dedicated stylist, 20% off" },
    ],
  },
  discounts: {
    welcome: { code: "WELCOME15", value: "15% off your first visit" },
    referral: { code: "REFER25", value: "£25 credit for you & a friend" },
  },
};

export type SalonConfig = typeof SALON_CONFIG;
