// Rich mock data for the Customer Dashboard MVP
export const member = {
  firstName: "James",
  lastName: "Pemberton",
  fullName: "James Pemberton",
  email: "james.pemberton@gmail.com",
  phone: "+44 7700 900 184",
  address: "27 Woodthorpe Road, Ashford, London TW15 2RL",
  memberSince: "March 2023",
  tier: "Gold" as "Bronze" | "Silver" | "Gold",
  points: 2450,
  pointsToNextTier: 550, // to Platinum (future)
  lifetimeVisits: 27,
  lifetimeSpend: 3210,
  avatarInitials: "JP",
  referralCode: "JAMES-VALE",
  referralLink: "hawthornevale.co.uk/r/JAMES-VALE",
};

export const nextAppointment = {
  id: "apt-501",
  service: "Luxury Haircut & Beard Sculpt",
  barber: "Theo Marlowe",
  date: "June 18, 2026",
  shortDate: "Thu 18 Jun",
  time: "2:30 PM",
  duration: "1 hr 25 min",
  status: "Confirmed" as const,
  location: "Chair 03 · Ashford",
};

export const upcoming = [
  nextAppointment,
  {
    id: "apt-502",
    service: "Heritage Hot-Towel Shave",
    barber: "Sebastian Cole",
    date: "July 2, 2026",
    shortDate: "Wed 02 Jul",
    time: "11:00 AM",
    duration: "45 min",
    status: "Confirmed" as const,
    location: "Suite 01 · Ashford",
  },
  {
    id: "apt-503",
    service: "Signature Master Cut",
    barber: "Theo Marlowe",
    date: "July 23, 2026",
    shortDate: "Wed 23 Jul",
    time: "5:15 PM",
    duration: "55 min",
    status: "Pending" as const,
    location: "Chair 03 · Ashford",
  },
];

export const history = [
  { id: "h01", service: "Signature Master Cut", barber: "Theo Marlowe", date: "08 May 2026", price: 85, rating: 5, fav: true },
  { id: "h02", service: "Beard Sculpt & Conditioning", barber: "Theo Marlowe", date: "12 Apr 2026", price: 45, rating: 5, fav: true },
  { id: "h03", service: "Executive Express", barber: "Sebastian Cole", date: "24 Mar 2026", price: 38, rating: 4, fav: false },
  { id: "h04", service: "Heritage Hot-Towel Shave", barber: "Theo Marlowe", date: "02 Mar 2026", price: 70, rating: 5, fav: true },
  { id: "h05", service: "Signature Master Cut", barber: "Theo Marlowe", date: "10 Feb 2026", price: 85, rating: 5, fav: false },
  { id: "h06", service: "Scalp Ritual Add-On", barber: "Lina Okafor", date: "10 Feb 2026", price: 25, rating: 5, fav: false },
  { id: "h07", service: "Beard Sculpt & Conditioning", barber: "Theo Marlowe", date: "18 Jan 2026", price: 45, rating: 4, fav: false },
  { id: "h08", service: "Signature Master Cut", barber: "Theo Marlowe", date: "21 Dec 2025", price: 85, rating: 5, fav: false },
  { id: "h09", service: "The Groom's Ritual", barber: "Sebastian Cole", date: "14 Nov 2025", price: 240, rating: 5, fav: false },
  { id: "h10", service: "Heritage Hot-Towel Shave", barber: "Theo Marlowe", date: "02 Oct 2025", price: 70, rating: 5, fav: true },
  { id: "h11", service: "Executive Express", barber: "Sebastian Cole", date: "12 Sep 2025", price: 38, rating: 4, fav: false },
  { id: "h12", service: "Signature Master Cut", barber: "Theo Marlowe", date: "20 Aug 2025", price: 85, rating: 5, fav: false },
];

export const tiers = [
  { name: "Bronze", min: 0, max: 999, perks: ["Birthday voucher", "Priority waitlist", "10% off retail"] },
  { name: "Silver", min: 1000, max: 1999, perks: ["All Bronze perks", "Complimentary scalp ritual quarterly", "15% off retail"] },
  { name: "Gold", min: 2000, max: 2999, perks: ["All Silver perks", "Private suite access", "Free beard trim monthly", "20% off retail", "Champagne on arrival"] },
];

export const rewards = [
  { id: "rw1", name: "Free Beard Trim", points: 400, available: true, image: "✂", note: "Redeem at next visit" },
  { id: "rw2", name: "Complimentary Service Upgrade", points: 800, available: true, image: "✦", note: "Add to any booking" },
  { id: "rw3", name: "Heritage Hot-Towel Shave", points: 1400, available: true, image: "♛", note: "Full 45-min experience" },
  { id: "rw4", name: "£40 Retail Credit", points: 1000, available: true, image: "❖", note: "Penhaligon's, Acqua di Parma" },
  { id: "rw5", name: "Private Suite Hour", points: 2200, available: true, image: "⌘", note: "Members-only suite" },
  { id: "rw6", name: "Year of Cuts (12)", points: 12000, available: false, image: "♔", note: "Locked — Gold tier required" },
];

export const couponList = [
  { code: "WELCOME10", label: "£10 off your next visit", expires: "30 Jun 2026", status: "Active", terms: "Excludes wedding packages." },
  { code: "GROOM15", label: "15% off Wedding Groom Package", expires: "31 Aug 2026", status: "Active", terms: "Single use. Cannot be combined." },
  { code: "REFER25", label: "£25 referral bonus", expires: "No expiry", status: "Active", terms: "Earned per successful referral." },
  { code: "SUMMER20", label: "Seasonal Luxury Ritual — 20% off", expires: "15 Sep 2026", status: "Active", terms: "Booking required Mon–Thu." },
  { code: "BIRTHDAY", label: "Birthday: Complimentary scalp ritual", expires: "Used 12 Apr", status: "Redeemed", terms: "Annual reward." },
];

export const notifs = [
  { id: "n1", category: "Appointment", text: "Reminder: Luxury Haircut & Beard Sculpt — Thu 18 Jun, 2:30 PM with Theo.", time: "2h ago", unread: true },
  { id: "n2", category: "Reward", text: "You've earned 85 points from your last visit.", time: "1d ago", unread: true },
  { id: "n3", category: "Membership", text: "Congratulations — you've reached Gold tier.", time: "3d ago", unread: true },
  { id: "n4", category: "Promotion", text: "Summer Ritual: 20% off bookings Mon–Thu through 15 Sep.", time: "5d ago", unread: false },
  { id: "n5", category: "Appointment", text: "Sebastian Cole confirmed your hot-towel shave on 02 Jul.", time: "1w ago", unread: false },
  { id: "n6", category: "Reward", text: "New reward unlocked: Private Suite Hour (2,200 pts).", time: "2w ago", unread: false },
];

export const favouriteServices = [
  { id: "fs1", name: "Signature Master Cut", price: 85, duration: "55 min", lastBooked: "08 May 2026" },
  { id: "fs2", name: "Heritage Hot-Towel Shave", price: 70, duration: "45 min", lastBooked: "02 Mar 2026" },
  { id: "fs3", name: "Beard Sculpt & Conditioning", price: 45, duration: "30 min", lastBooked: "12 Apr 2026" },
];

export const preferences = {
  stylist: "Theo Marlowe",
  service: "Signature Master Cut",
  days: ["Thursday", "Saturday"],
  times: "Afternoon (2pm – 5pm)",
  communication: "WhatsApp",
};

export const referrals = [
  { name: "Henry Caldwell", date: "12 May 2026", status: "Joined", reward: "£25 credit" },
  { name: "Marcus Adeyemi", date: "02 Apr 2026", status: "Joined", reward: "£25 credit" },
  { name: "Rohan Mehra", date: "18 Mar 2026", status: "Joined", reward: "£25 credit" },
  { name: "Edward Sinclair", date: "01 Feb 2026", status: "Invited", reward: "Pending" },
];

export const faqs = [
  { q: "How do I reschedule an appointment?", a: "Open Appointments and select Reschedule. Changes are free up to 24 hours before your booking." },
  { q: "How are loyalty points earned?", a: "1 point per £1 spent, plus tier bonuses (Gold members earn 1.5×)." },
  { q: "When do rewards expire?", a: "Points never expire while your membership is active." },
  { q: "Can I gift a service?", a: "Yes — speak with our concierge or order a hand-pressed gift card from the Promotions page." },
];
