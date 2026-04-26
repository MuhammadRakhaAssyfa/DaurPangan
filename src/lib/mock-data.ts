// Mock data for DaurPangan
import { type ReactNode } from "react";

export type FoodStatus = "available" | "claimed" | "expired";

export interface FoodListing {
  id: string;
  name: string;
  provider: string;
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
    provider: "Kafe Kebon Sirih",
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
