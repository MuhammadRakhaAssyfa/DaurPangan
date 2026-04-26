// Mock data for DaurPangan

export type FoodStatus = "available" | "claimed" | "expired";

export type ProviderType = "restoran" | "hotel" | "toko" | "rumah";

export interface ProviderTypeMeta {
  id: ProviderType;
  label: string;
  desc: string;
  emoji: string;
  /** Tailwind classes for badge */
  badgeClass: string;
}

export const providerTypes: ProviderTypeMeta[] = [
  {
    id: "restoran",
    label: "Restoran",
    desc: "Restoran, warung, atau tempat makan",
    emoji: "🍽️",
    badgeClass: "bg-primary/10 text-primary border-primary/30",
  },
  {
    id: "hotel",
    label: "Hotel & Katering",
    desc: "Hotel, katering, atau jasa boga",
    emoji: "🏨",
    badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400",
  },
  {
    id: "toko",
    label: "Toko & Pasar",
    desc: "Toko kelontong, supermarket, atau pedagang pasar",
    emoji: "🛒",
    badgeClass: "bg-accent/15 text-accent-foreground border-accent/40",
  },
  {
    id: "rumah",
    label: "Rumah Tangga",
    desc: "Perorangan atau keluarga",
    emoji: "🏠",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
];

export const providerTypeMap: Record<ProviderType, ProviderTypeMeta> =
  Object.fromEntries(providerTypes.map((p) => [p.id, p])) as Record<ProviderType, ProviderTypeMeta>;

export type ProductCondition = "segar" | "mendekati" | "sisa";

export const conditionMap: Record<ProductCondition, { label: string; className: string }> = {
  segar: { label: "Segar", className: "bg-success/10 text-success border-success/30" },
  mendekati: { label: "Mendekati expired", className: "bg-accent/15 text-accent-foreground border-accent/40" },
  sisa: { label: "Sisa display", className: "bg-muted text-muted-foreground border-border" },
};

export interface FoodListing {
  id: string;
  name: string;
  provider: string;
  providerType: ProviderType;
  providerRating: number;
  image: string;
  /** Numeric quantity remaining (porsi/kg/box/etc) */
  quantityValue: number;
  /** Unit label, e.g. "porsi", "kg", "ikat", "bungkus" */
  quantityUnit: string;
  /** Pre-formatted display string (kept for compatibility) */
  quantity: string;
  expiresAt: Date;
  /** Whether expiry is per-day (toko & pasar) instead of hourly */
  expiryGranularity?: "hour" | "day";
  distanceKm: number;
  walkMinutes?: number;
  isFree: boolean;
  price?: number;
  /** Original price used to render strikethrough discount */
  originalPrice?: number;
  /** Full pickup address (hidden for rumah tangga) */
  location: string;
  /** Area only — kelurahan/kecamatan, used for rumah tangga */
  area?: string;
  status: FoodStatus;
  category: "nasi" | "roti" | "sayur" | "buah" | "kue";
  /** Optional notes shown on detail/claim */
  notes?: string;
  /** Minimum claim quantity (Hotel & Katering) */
  minClaim?: number;
  /** Product freshness/condition (Toko & Pasar) */
  condition?: ProductCondition;
  /** Whether the listing requires manual provider confirmation before deal */
  requiresConfirmation?: boolean;
  /** Geo coordinates for map display */
  lat?: number;
  lng?: number;
}

/** Default Jakarta center used by the recipient map */
export const JAKARTA_CENTER = { lat: -6.2088, lng: 106.8456 };

const inHours = (h: number) => new Date(Date.now() + h * 3600 * 1000);

export const mockListings: FoodListing[] = [
  {
    id: "1",
    name: "Nasi Box Catering Acara",
    provider: "Hotel Sahid Jakarta",
    providerType: "hotel",
    providerRating: 4.9,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=70",
    quantityValue: 25,
    quantityUnit: "porsi",
    quantity: "25 porsi",
    expiresAt: inHours(3),
    distanceKm: 1.2,
    walkMinutes: 15,
    isFree: true,
    location: "Jl. Jend. Sudirman No. 86, Jakarta Pusat",
    status: "available",
    category: "nasi",
    minClaim: 10,
    notes: "Halal, tersedia packaging box.",
  },
  {
    id: "2",
    name: "Roti Tawar Hampir Expired",
    provider: "BreadTalk Plaza Senayan",
    providerType: "toko",
    providerRating: 4.7,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=70",
    quantityValue: 15,
    quantityUnit: "bungkus",
    quantity: "15 bungkus",
    expiresAt: inHours(8),
    expiryGranularity: "day",
    distanceKm: 2.4,
    walkMinutes: 28,
    isFree: false,
    price: 5000,
    originalPrice: 18000,
    location: "Plaza Senayan Lt. 1, Senayan",
    status: "available",
    category: "roti",
    condition: "mendekati",
  },
  {
    id: "3",
    name: "Sayur Bayam Segar",
    provider: "Pasar Mayestik",
    providerType: "toko",
    providerRating: 4.6,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=70",
    quantityValue: 5,
    quantityUnit: "kg",
    quantity: "5 kg",
    expiresAt: inHours(12),
    expiryGranularity: "day",
    distanceKm: 0.8,
    walkMinutes: 10,
    isFree: true,
    location: "Lapak A12, Pasar Mayestik, Kebayoran Baru",
    status: "available",
    category: "sayur",
    condition: "segar",
  },
  {
    id: "4",
    name: "Nasi Ayam Bakar Sisa Makan Siang",
    provider: "Restoran Bunga Rampai",
    providerType: "restoran",
    providerRating: 4.8,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=70",
    quantityValue: 10,
    quantityUnit: "porsi",
    quantity: "10 porsi",
    expiresAt: inHours(5),
    distanceKm: 3.1,
    walkMinutes: 36,
    isFree: false,
    price: 8000,
    originalPrice: 35000,
    location: "Jl. Teuku Cik Ditiro No. 35, Menteng",
    status: "available",
    category: "buah",
    notes: "Mengandung kacang.",
  },
  {
    id: "5",
    name: "Kue Lebaran Buatan Sendiri",
    provider: "Bu Sari",
    providerType: "rumah",
    providerRating: 4.5,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=70",
    quantityValue: 30,
    quantityUnit: "buah",
    quantity: "30 buah",
    expiresAt: inHours(2),
    distanceKm: 1.7,
    walkMinutes: 20,
    isFree: true,
    location: "private",
    area: "Tanah Abang",
    status: "available",
    category: "kue",
    notes: "Bisa diantar radius 1km.",
    requiresConfirmation: true,
  },
  {
    id: "6",
    name: "Nasi Padang Lengkap",
    provider: "RM Sederhana",
    providerType: "restoran",
    providerRating: 4.9,
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=70",
    quantityValue: 12,
    quantityUnit: "porsi",
    quantity: "12 porsi",
    expiresAt: inHours(4),
    distanceKm: 2.0,
    walkMinutes: 24,
    isFree: false,
    price: 10000,
    originalPrice: 28000,
    location: "Jl. Sabang No. 19, Jakarta Pusat",
    status: "available",
    category: "nasi",
  },
];

export const impactStats = {
  kgSaved: 12_847,
  providers: 320,
  recipients: 5_640,
  meals: 38_900,
};

// History (mock) — for both provider & recipient
export interface PickupRecord {
  id: string;
  listingId: string;
  listingName: string;
  image: string;
  counterparty: string; // other party name
  counterpartyType?: ProviderType;
  date: Date;
  isFree: boolean;
  price?: number;
  quantity: string;
  /** Whether the current user has rated this transaction yet */
  rated: boolean;
  rating?: number;
  review?: string;
}

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);

export const mockRecipientHistory: PickupRecord[] = [
  {
    id: "h1",
    listingId: "1",
    listingName: "Nasi Box Catering",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=70",
    counterparty: "Hotel Sahid Jakarta",
    counterpartyType: "hotel",
    date: daysAgo(1),
    isFree: true,
    quantity: "2 porsi",
    rated: false,
  },
  {
    id: "h2",
    listingId: "2",
    listingName: "Roti Tawar & Pastry",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=70",
    counterparty: "BreadTalk Plaza Senayan",
    counterpartyType: "toko",
    date: daysAgo(3),
    isFree: false,
    price: 5000,
    quantity: "1 bungkus",
    rated: true,
    rating: 5,
    review: "Rotinya masih sangat segar, terima kasih!",
  },
  {
    id: "h3",
    listingId: "5",
    listingName: "Kue Tradisional",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=70",
    counterparty: "Bu Sari (Rumah Tangga)",
    counterpartyType: "rumah",
    date: daysAgo(7),
    isFree: true,
    quantity: "5 buah",
    rated: false,
  },
];

export const mockProviderHistory: PickupRecord[] = [
  {
    id: "ph1",
    listingId: "1",
    listingName: "Nasi Box Acara",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=70",
    counterparty: "Andi Pratama",
    date: daysAgo(2),
    isFree: true,
    quantity: "5 porsi",
    rated: false,
  },
  {
    id: "ph2",
    listingId: "4",
    listingName: "Buah Potong Premium",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=70",
    counterparty: "Yayasan Sahabat",
    date: daysAgo(5),
    isFree: false,
    price: 8000,
    quantity: "3 box",
    rated: true,
    rating: 5,
    review: "Penerima sangat ramah dan tepat waktu.",
  },
];

export interface RecipientNotification {
  id: string;
  title: string;
  body: string;
  date: Date;
  read: boolean;
  listingId?: string;
}

export const mockNotifications: RecipientNotification[] = [
  {
    id: "n1",
    title: "Makanan baru di sekitar Anda",
    body: "Hotel Sahid Jakarta baru saja membagikan 25 porsi Nasi Box. 1.2 km dari Anda.",
    date: new Date(Date.now() - 5 * 60_000),
    read: false,
    listingId: "1",
  },
  {
    id: "n2",
    title: "Pengingat: jemput Roti Tawar",
    body: "Listing yang Anda klaim akan kedaluwarsa dalam 2 jam.",
    date: new Date(Date.now() - 35 * 60_000),
    read: false,
  },
  {
    id: "n3",
    title: "Bu Sari membagikan kue",
    body: "30 buah kue tradisional gratis di Tanah Abang.",
    date: new Date(Date.now() - 3 * 3600_000),
    read: true,
    listingId: "5",
  },
];

// ============= Provider directory (public profiles) =============

export interface ProviderReview {
  id: string;
  authorName: string; // first name only — privacy
  rating: number;
  comment: string;
  date: Date;
}

export interface ProviderImpactStats {
  kgSaved: number;
  totalUploads: number;
  recipientsHelped: number;
}

export interface ProviderProfile {
  id: string;
  name: string;
  type: ProviderType;
  area: string;
  rating: number;
  totalReviews: number;
  bio: string;
  avatar: string;
  impact: ProviderImpactStats;
  reviews: ProviderReview[];
}

const reviewsFor = (seed: string): ProviderReview[] => [
  {
    id: `${seed}-r1`,
    authorName: "Andi",
    rating: 5,
    comment: "Makanannya masih hangat dan ramah sekali, terima kasih!",
    date: daysAgo(2),
  },
  {
    id: `${seed}-r2`,
    authorName: "Sari",
    rating: 5,
    comment: "Pickup mudah, packagingnya rapi.",
    date: daysAgo(5),
  },
  {
    id: `${seed}-r3`,
    authorName: "Budi",
    rating: 4,
    comment: "Porsinya banyak, sangat membantu komunitas kami.",
    date: daysAgo(9),
  },
];

export const mockProviders: ProviderProfile[] = [
  {
    id: "p-hotel-sahid",
    name: "Hotel Sahid Jakarta",
    type: "hotel",
    area: "Jakarta Pusat",
    rating: 4.9,
    totalReviews: 124,
    bio: "Hotel bintang lima yang rutin membagikan surplus katering acara untuk komunitas sekitar.",
    avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=70",
    impact: { kgSaved: 482, totalUploads: 96, recipientsHelped: 312 },
    reviews: reviewsFor("hotel-sahid"),
  },
  {
    id: "p-breadtalk",
    name: "BreadTalk Plaza Senayan",
    type: "toko",
    area: "Senayan",
    rating: 4.7,
    totalReviews: 88,
    bio: "Toko roti yang membagikan stok mendekati expired setiap sore.",
    avatar: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=70",
    impact: { kgSaved: 230, totalUploads: 142, recipientsHelped: 410 },
    reviews: reviewsFor("breadtalk"),
  },
  {
    id: "p-mayestik",
    name: "Pasar Mayestik",
    type: "toko",
    area: "Kebayoran Baru",
    rating: 4.6,
    totalReviews: 54,
    bio: "Pedagang sayur kolektif yang membagikan hasil panen sisa setiap akhir hari.",
    avatar: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=300&q=70",
    impact: { kgSaved: 612, totalUploads: 201, recipientsHelped: 380 },
    reviews: reviewsFor("mayestik"),
  },
  {
    id: "p-bunga-rampai",
    name: "Restoran Bunga Rampai",
    type: "restoran",
    area: "Menteng",
    rating: 4.8,
    totalReviews: 76,
    bio: "Restoran nusantara yang berkomitmen mengurangi food waste setiap hari.",
    avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=70",
    impact: { kgSaved: 198, totalUploads: 64, recipientsHelped: 220 },
    reviews: reviewsFor("bunga-rampai"),
  },
  {
    id: "p-bu-sari",
    name: "Bu Sari",
    type: "rumah",
    area: "Tanah Abang",
    rating: 4.5,
    totalReviews: 18,
    bio: "Ibu rumah tangga yang sering membagikan masakan rumahan untuk tetangga.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=70",
    impact: { kgSaved: 24, totalUploads: 19, recipientsHelped: 31 },
    reviews: reviewsFor("bu-sari"),
  },
  {
    id: "p-sederhana",
    name: "RM Sederhana",
    type: "restoran",
    area: "Jakarta Pusat",
    rating: 4.9,
    totalReviews: 102,
    bio: "Rumah makan padang yang aktif berbagi sisa nasi & lauk setiap malam.",
    avatar: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=300&q=70",
    impact: { kgSaved: 356, totalUploads: 130, recipientsHelped: 295 },
    reviews: reviewsFor("sederhana"),
  },
];

export const providerProfileMap: Record<string, ProviderProfile> = Object.fromEntries(
  mockProviders.map((p) => [p.id, p]),
);

/** Map a listing's provider name to a provider profile id when possible */
export const providerIdByName: Record<string, string> = Object.fromEntries(
  mockProviders.map((p) => [p.name, p.id]),
);

