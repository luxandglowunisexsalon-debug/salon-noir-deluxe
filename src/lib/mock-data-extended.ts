import shaveImg from "@/assets/service-shave.jpg";
import cutImg from "@/assets/service-haircut.jpg";
import beardImg from "@/assets/service-beard.jpg";
import heroImg from "@/assets/hero-salon.jpg";
import storefrontAsset from "@/assets/lux-glow-storefront.jpeg.asset.json";
import interiorWideAsset from "@/assets/lux-glow-interior-wide.jpeg.asset.json";
import interiorChairsAsset from "@/assets/lux-glow-interior-chairs.jpeg.asset.json";
import windowAsset from "@/assets/lux-glow-window.jpeg.asset.json";

// --- Pricing / Membership ---
export const membershipPlans = [
  {
    tier: "Bronze",
    price: 65,
    cadence: "per month",
    tagline: "An introduction to the house.",
    perks: [
      "One Signature Master Cut per month",
      "10% off retail",
      "Complimentary espresso & still water",
      "Priority weekday booking",
    ],
    featured: false,
  },
  {
    tier: "Silver",
    price: 145,
    cadence: "per month",
    tagline: "The connoisseur's monthly ritual.",
    perks: [
      "One Master Cut + one Hot-Towel Shave",
      "Beard sculpt at half-price",
      "15% off retail & gifting",
      "Complimentary champagne service",
      "Member-only Saturday hours",
    ],
    featured: true,
  },
  {
    tier: "Gold",
    price: 285,
    cadence: "per month",
    tagline: "The complete house experience.",
    perks: [
      "Unlimited cuts, shaves & beard rituals",
      "Quarterly grooming consultation",
      "Dedicated stylist",
      "Private suite when reserved",
      "Two guest passes per quarter",
      "20% off retail & treatments",
    ],
    featured: false,
  },
];

export const packageDeals = [
  {
    name: "The Ashford Trio",
    price: 175,
    saving: 25,
    items: ["Signature Master Cut", "Hot-Towel Shave", "Beard Sculpt"],
  },
  {
    name: "The Diplomat",
    price: 220,
    saving: 35,
    items: ["Executive Cut × 3", "Express Shave × 2", "Scalp ritual"],
  },
  {
    name: "Father & Son",
    price: 140,
    saving: 30,
    items: ["Two cuts", "Hot towel service", "Polaroid memento"],
  },
];

export const groomPackages = [
  {
    name: "The Registrar",
    price: 320,
    duration: "2.5 hr",
    body: "Cut, hot-towel shave and finishing for the intimate ceremony.",
    includes: ["Pre-wedding consultation", "Day-of grooming", "Champagne service"],
  },
  {
    name: "The Ashford Wedding",
    price: 540,
    duration: "Full morning",
    body: "Private suite for the groom, best man and father. The signature offer.",
    includes: ["Suite for three", "Master cut & shave each", "Photographer access", "Breakfast service"],
  },
  {
    name: "The Estate",
    price: 980,
    duration: "On location",
    body: "Our stylist can travel to your home or venue in the Ashford area.",
    includes: ["Up to six clients", "On-site service", "Travel within M25", "Bespoke aftercare kits"],
  },
];

// --- Gallery ---
export const galleryCategories = ["All", "Cuts", "Beards", "Shaves", "Weddings", "Interiors"] as const;

export const galleryItems = [
  { id: "g1", src: cutImg, category: "Cuts", title: "The Ashford Sweep" },
  { id: "g2", src: beardImg, category: "Beards", title: "Sculpted Long Beard" },
  { id: "g3", src: shaveImg, category: "Shaves", title: "Heritage Hot-Towel" },
  { id: "g4", src: interiorWideAsset.url, category: "Interiors", title: "The Salon Floor" },
  { id: "g5", src: cutImg, category: "Weddings", title: "Claridge's Groom" },
  { id: "g6", src: beardImg, category: "Beards", title: "Salt & Pepper Trim" },
  { id: "g7", src: cutImg, category: "Cuts", title: "Side Part, Soft Finish" },
  { id: "g8", src: shaveImg, category: "Shaves", title: "Single-Blade Ritual" },
  { id: "g9", src: interiorChairsAsset.url, category: "Interiors", title: "Styling Stations" },
  { id: "g10", src: cutImg, category: "Weddings", title: "Country House Wedding" },
  { id: "g11", src: beardImg, category: "Beards", title: "The Curated Stubble" },
  { id: "g12", src: cutImg, category: "Cuts", title: "Crop with Texture" },
  { id: "g13", src: storefrontAsset.url, category: "Interiors", title: "Lux & Glow, Ashford" },
  { id: "g14", src: windowAsset.url, category: "Interiors", title: "A View Through the Window" },
];

export const beforeAfterPairs = [
  { id: "ba1", before: beardImg, after: cutImg, label: "The Boardroom Refresh", category: "Cuts" },
  { id: "ba2", before: shaveImg, after: beardImg, label: "Beard Reformation", category: "Beards" },
  { id: "ba3", before: cutImg, after: shaveImg, label: "Wedding Morning", category: "Weddings" },
];

// --- Reviews ---
export const reviewStats = {
  average: 4.92,
  total: 1284,
  distribution: [
    { stars: 5, pct: 92 },
    { stars: 4, pct: 6 },
    { stars: 3, pct: 1.5 },
    { stars: 2, pct: 0.3 },
    { stars: 1, pct: 0.2 },
  ],
  sources: [
    { name: "Google", rating: 4.9, count: 612 },
    { name: "Treatwell", rating: 5.0, count: 318 },
    { name: "Tatler Address Book", rating: 5.0, count: "Listed" },
    { name: "Square Mile", rating: 4.9, count: 354 },
  ],
};

export const fullReviews = [
  {
    name: "Hon. James Whitfield",
    role: "Barrister, Lincoln's Inn",
    date: "May 2026",
    rating: 5,
    service: "Heritage Hot-Towel Shave",
    quote:
      "A standard of grooming I had only ever found in Milan. The hot-towel ritual is a quiet hour I now refuse to live without.",
    featured: true,
  },
  {
    name: "Marcus Adeyemi",
    role: "MD, Goldsmith Capital",
    date: "May 2026",
    rating: 5,
    service: "Signature Master Cut",
    quote:
      "Discreet, immaculate and astonishingly consistent. My entire team books here before every board week.",
    featured: true,
  },
  {
    name: "Oliver & Clementine Hayes",
    role: "Married at Claridge's",
    date: "June 2025",
    rating: 5,
    service: "The Groom's Ritual",
    quote:
      "The most composed hour of our wedding day. Champagne, calm and a flawless finish — Theo is a wizard.",
    featured: true,
  },
  {
    name: "Rohan Mehra",
    role: "Founder, Atlas Studio",
    date: "April 2026",
    rating: 5,
    service: "Beard Sculpt & Conditioning",
    quote: "Sebastian reshaped a beard I had given up on. Three friends have already booked.",
    featured: false,
  },
  {
    name: "Edward Sinclair",
    role: "Private banker",
    date: "March 2026",
    rating: 5,
    service: "Executive Express",
    quote: "Twenty-five minutes, in and out, looking faultless. Exactly what a Tuesday morning demands.",
    featured: false,
  },
  {
    name: "Dr. Anand Kapoor",
    role: "Harley Street",
    date: "February 2026",
    rating: 5,
    service: "Signature Master Cut",
    quote: "Genuine craftsmanship. The interiors alone are worth the visit; the cut keeps me coming back.",
    featured: false,
  },
];

export const videoReviews = [
  { id: "v1", name: "Marcus A.", title: "Why I book before every board week", duration: "1:42", thumb: heroImg },
  { id: "v2", name: "Oliver H.", title: "Our wedding morning at H&V", duration: "2:18", thumb: cutImg },
  { id: "v3", name: "Theo M.", title: "Behind the hot-towel ritual", duration: "3:04", thumb: shaveImg },
];

// --- Promotions ---
export const promotionsPage = {
  hero: {
    eyebrow: "House Offers",
    title: "Considered offers, never gimmicks.",
    body: "A small, curated selection of seasonal moments and member rituals.",
  },
  firstVisit: {
    title: "The Welcome Ritual",
    body: "15% off your first appointment and a complimentary scalp oil to take home.",
    code: "WELCOME15",
    expires: "Ongoing",
  },
  seasonal: [
    {
      title: "Wedding Season",
      window: "May — September",
      body: "Complimentary champagne service for the groom's party with any wedding booking.",
      code: "BRIDEGROOM",
    },
    {
      title: "Midsummer Beard Edit",
      window: "June — August",
      body: "20% off Beard Sculpt & Conditioning, Tuesday to Thursday.",
      code: "MIDSUMMER",
    },
    {
      title: "Festive Client",
      window: "December",
      body: "Bespoke gift cards in hand-pressed envelopes, delivered within W1 by bicycle.",
      code: "FESTIVE",
    },
  ],
  referral: {
    title: "The Referral",
    body: "Introduce a friend and receive £25 credit each — applied automatically on their first visit.",
    code: "REFER25",
  },
  member: [
    "Priority Saturday morning booking",
    "Complimentary monthly grooming gift",
    "Early access to limited-edition retail drops",
    "Two annual guest passes",
  ],
};

// --- Blog ---
export const blogPosts = [
  {
    slug: "the-quiet-art-of-the-hot-towel",
    title: "The quiet art of the hot-towel shave",
    excerpt: "Why a slow, single-blade shave is the most underrated ritual a man can keep.",
    category: "Heritage",
    readTime: "6 min",
    date: "12 May 2026",
    author: "Theo Marlowe",
    image: shaveImg,
  },
  {
    slug: "what-a-master-cut-actually-means",
    title: "What a 'master cut' actually means",
    excerpt: "Twelve years on the chair, a thousand cuts a year, and the small details that separate a trim from a tailored cut.",
    category: "Craft",
    readTime: "8 min",
    date: "28 April 2026",
    author: "Sebastian Ash",
    image: cutImg,
  },
  {
    slug: "the-grooms-week",
    title: "The Groom's Week: a five-day grooming diary",
    excerpt: "From the rehearsal dinner to the morning of — exactly how we prepare our clients for the day.",
    category: "Weddings",
    readTime: "10 min",
    date: "14 April 2026",
    author: "Henry Caldwell",
    image: heroImg,
  },
  {
    slug: "beard-oil-decoded",
    title: "Beard oil, decoded",
    excerpt: "Sandalwood, vetiver, jojoba — what to use, when to use it, and why most of the high street gets it wrong.",
    category: "Notes",
    readTime: "5 min",
    date: "01 April 2026",
    author: "Theo Marlowe",
    image: beardImg,
  },
  {
    slug: "the-mayfair-address",
    title: "Notes from Woodthorpe Road",
    excerpt: "A walking guide to our corner of Ashford — from the tailors to the tea rooms — for visiting clients.",
    category: "City",
    readTime: "7 min",
    date: "18 March 2026",
    author: "Editorial",
    image: heroImg,
  },
  {
    slug: "scalp-rituals",
    title: "Scalp rituals worth keeping",
    excerpt: "The five-minute weekly practice that meaningfully changes how your hair behaves over a year.",
    category: "Wellbeing",
    readTime: "4 min",
    date: "02 March 2026",
    author: "Sebastian Ash",
    image: cutImg,
  },
];
