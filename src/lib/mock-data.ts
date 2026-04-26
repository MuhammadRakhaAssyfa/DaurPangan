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

export interface FoodListing {
  id: string;
  name: string;
  provider: string;
  providerType: ProviderType;
  providerRating: number;
  image: string;
  quantity: string;
  expiresAt: Date;
  distanceKm: number;
  isFree: boolean;
  price?: number;
  location: string;
  status: FoodStatus;
  category: "nasi" | "roti" | "sayur" | "buah" | "kue";
}

const inHours = (h: number) => new Date(Date.now() + h * 3600 * 1000);

export const mockListings: FoodListing[] = [
  {
    id: "1",
    name: "Nasi Box Catering",
    provider: "Hotel Sahid Jakarta",
    providerType: "hotel",
    providerRating: 4.9,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=70",
    quantity: "25 porsi",
    expiresAt: inHours(3),
    distanceKm: 1.2,
    isFree: true,
    location: "Jakarta Pusat",
    status: "available",
    category: "nasi",
  },
  {
    id: "2",
    name: "Roti Tawar & Pastry",
    provider: "BreadTalk Plaza Senayan",
    providerType: "toko",
    providerRating: 4.7,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=70",
    quantity: "15 bungkus",
    expiresAt: inHours(8),
    distanceKm: 2.4,
    isFree: false,
    price: 5000,
    location: "Senayan",
    status: "available",
    category: "roti",
  },
  {
    id: "3",
    name: "Sayur Segar Pasar",
    provider: "Pasar Mayestik",
    providerType: "toko",
    providerRating: 4.6,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=70",
    quantity: "5 kg",
    expiresAt: inHours(12),
    distanceKm: 0.8,
    isFree: true,
    location: "Kebayoran Baru",
    status: "available",
    category: "sayur",
  },
  {
    id: "4",
    name: "Buah Potong Premium",
    provider: "Restoran Bunga Rampai",
    providerType: "restoran",
    providerRating: 4.8,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=70",
    quantity: "10 box",
    expiresAt: inHours(5),
    distanceKm: 3.1,
    isFree: false,
    price: 8000,
    location: "Menteng",
    status: "available",
    category: "buah",
  },
  {
    id: "5",
    name: "Kue Tradisional",
    provider: "Bu Sari (Rumah Tangga)",
    providerType: "rumah",
    providerRating: 4.5,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=70",
    quantity: "30 buah",
    expiresAt: inHours(2),
    distanceKm: 1.7,
    isFree: true,
    location: "Tanah Abang",
    status: "available",
    category: "kue",
  },
  {
    id: "6",
    name: "Nasi Padang Lengkap",
    provider: "RM Sederhana",
    providerType: "restoran",
    providerRating: 4.9,
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=70",
    quantity: "12 porsi",
    expiresAt: inHours(4),
    distanceKm: 2.0,
    isFree: false,
    price: 10000,
    location: "Sabang",
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
