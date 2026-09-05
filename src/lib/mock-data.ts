import shaveImg from "@/assets/service-shave.jpg";
import cutImg from "@/assets/service-haircut.jpg";
import beardImg from "@/assets/service-beard.jpg";

export const services = [
  {
    id: "signature-cut",
    name: "Signature Master Cut",
    duration: "55 min",
    price: 85,
    description:
      "Consultation, bespoke cut, scalp ritual and finishing styling with our master barber.",
    image: cutImg,
    category: "Hair",
    featured: true,
  },
  {
    id: "hot-towel-shave",
    name: "Heritage Hot-Towel Shave",
    duration: "45 min",
    price: 70,
    description:
      "Traditional cut-throat shave layered with warm towels, sandalwood oil and a cooling balm.",
    image: shaveImg,
    category: "Shave",
    featured: true,
  },
  {
    id: "beard-sculpt",
    name: "Beard Sculpt & Conditioning",
    duration: "30 min",
    price: 45,
    description: "Precision line-up, deep-condition oil mask and finishing wax.",
    image: beardImg,
    category: "Beard",
    featured: true,
  },
  {
    id: "wedding-package",
    name: "The Groom's Ritual",
    duration: "2 hr",
    price: 240,
    description:
      "Full grooming experience for the wedding day — cut, shave, facial, champagne service.",
    image: cutImg,
    category: "Wedding",
    featured: true,
  },
  {
    id: "executive-clean",
    name: "Executive Express",
    duration: "25 min",
    price: 38,
    description: "A polished cut and tidy designed for the diary of a busy professional.",
    image: cutImg,
    category: "Hair",
  },
  {
    id: "father-son",
    name: "Father & Son Hour",
    duration: "60 min",
    price: 95,
    description: "A shared chair experience for two generations.",
    image: cutImg,
    category: "Hair",
  },
];

export const testimonials = [
  {
    name: "Hon. James Whitfield",
    role: "Barrister, Lincoln's Inn",
    quote:
      "A standard of grooming I had only ever found in Milan. The hot-towel shave is a quiet ritual I now refuse to live without.",
  },
  {
    name: "Marcus Adeyemi",
    role: "Managing Director, Goldsmith Capital",
    quote:
      "Discreet, immaculate and astonishingly consistent. My team books here before every board week.",
  },
  {
    name: "Oliver & Clementine Hayes",
    role: "Married at Claridge's, June 2025",
    quote:
      "The Groom's Ritual was the most composed hour of our wedding day. Champagne, calm and a flawless finish.",
  },
];

export const beforeAfter = [
  { before: cutImg, after: cutImg, name: "The Ashford Sweep" },
  { before: beardImg, after: beardImg, name: "The Curated Beard" },
  { before: shaveImg, after: shaveImg, name: "The Heritage Shave" },
];

export const instagramFeed = [cutImg, shaveImg, beardImg, cutImg, shaveImg, beardImg];

export const promotions = [
  {
    title: "Welcome Ritual",
    body: "15% off your first appointment with code WELCOME15.",
    badge: "New Members",
  },
  {
    title: "The Groom's Diary",
    body: "Complimentary champagne service with any wedding booking before 31 August.",
    badge: "Seasonal",
  },
];

// --- Customer Dashboard mock data ---
export const currentCustomer = {
  name: "Alexander Pemberton",
  email: "alex.pemberton@gmail.com",
  joined: "March 2023",
  tier: "Champagne",
  points: 2140,
  pointsToNext: 1860,
  visits: 27,
};

export const upcomingAppointments = [
  {
    id: "apt-101",
    service: "Signature Master Cut",
    barber: "Theo Marlowe",
    date: "Thu, 12 June",
    time: "10:30",
    status: "Confirmed",
  },
  {
    id: "apt-102",
    service: "Heritage Hot-Towel Shave",
    barber: "Theo Marlowe",
    date: "Sat, 28 June",
    time: "14:00",
    status: "Confirmed",
  },
];

export const bookingHistory = [
  { id: "h1", service: "Signature Master Cut", date: "08 May 2026", price: 85, status: "Completed" },
  { id: "h2", service: "Beard Sculpt", date: "12 Apr 2026", price: 45, status: "Completed" },
  { id: "h3", service: "Executive Express", date: "24 Mar 2026", price: 38, status: "Completed" },
  { id: "h4", service: "Hot-Towel Shave", date: "02 Mar 2026", price: 70, status: "Completed" },
];

export const customerNotifications = [
  { id: "n1", text: "Your Champagne tier reward is ready: 10% off retail.", time: "2h" },
  { id: "n2", text: "Theo Marlowe has confirmed your appointment on 12 June.", time: "1d" },
  { id: "n3", text: "New seasonal service: Spring Botanical Facial.", time: "3d" },
];

export const coupons = [
  { code: "TIER10", label: "10% off your next visit", expires: "30 Jun" },
  { code: "RETAIL5", label: "£5 off any retail purchase", expires: "15 Jul" },
];

// --- Admin Dashboard mock data ---
export const adminMetrics = {
  monthlyRevenue: 42860,
  monthlyRevenueDelta: 12.4,
  totalBookings: 612,
  totalBookingsDelta: 8.1,
  returningCustomers: 78,
  loyaltyMembers: 1284,
  satisfaction: 4.92,
};

export const adminBookings = [
  { id: "b1", customer: "Alexander Pemberton", service: "Signature Master Cut", date: "12 Jun · 10:30", barber: "Theo", status: "Confirmed" },
  { id: "b2", customer: "Rohan Mehra", service: "Hot-Towel Shave", date: "12 Jun · 11:45", barber: "Sebastian", status: "Confirmed" },
  { id: "b3", customer: "James Whitfield", service: "Executive Express", date: "12 Jun · 13:00", barber: "Theo", status: "Pending" },
  { id: "b4", customer: "Olivia Hartwell (gift)", service: "Groom's Ritual", date: "13 Jun · 09:00", barber: "Sebastian", status: "Confirmed" },
  { id: "b5", customer: "Marcus Adeyemi", service: "Beard Sculpt", date: "13 Jun · 16:30", barber: "Theo", status: "Confirmed" },
];

export const adminCustomers = [
  { name: "Alexander Pemberton", tier: "Champagne", visits: 27, spend: 2140, last: "08 May" },
  { name: "Marcus Adeyemi", tier: "Vale", visits: 41, spend: 4310, last: "29 May" },
  { name: "Rohan Mehra", tier: "Brass", visits: 9, spend: 720, last: "30 May" },
  { name: "James Whitfield", tier: "Champagne", visits: 22, spend: 1980, last: "02 Jun" },
];

export const adminReviews = [
  { name: "Marcus A.", rating: 5, text: "Faultless. Will not go anywhere else.", date: "2d" },
  { name: "Rohan M.", rating: 5, text: "Theo is a craftsman. The shave is unbeatable.", date: "5d" },
  { name: "Edward S.", rating: 4, text: "Beautiful interior. Slight wait time on Saturday.", date: "1w" },
];

export const popularServices = [
  { name: "Signature Master Cut", bookings: 184 },
  { name: "Hot-Towel Shave", bookings: 128 },
  { name: "Beard Sculpt", bookings: 96 },
  { name: "Executive Express", bookings: 82 },
];
