import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Package, Leaf, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type FoodListing } from "@/lib/mock-data";
import { UploadFoodDialog } from "@/components/provider/UploadFoodDialog";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyle: Record<FoodListing["status"], string> = {
  available: "bg-success/10 text-success border-success/20",
  claimed: "bg-accent/15 text-accent-foreground border-accent/30",
  expired: "bg-muted text-muted-foreground border-border",
};
const statusLabel: Record<FoodListing["status"], string> = {
  available: "Tersedia",
  claimed: "Diklaim",
  expired: "Kedaluwarsa",
};

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  // New accounts start with no listings — never seed dummy data.
  const [listings, setListings] = useState<FoodListing[]>([]);

  const totalUploads = listings.length;
  const claimed = listings.filter((l) => l.status === "claimed").length;
  // ~0.4 kg per portion as a simple estimator. Only counts claimed listings
  // (treated as picked up for demo purposes). Real value will come from
  // pickup confirmation in production.
  const kgSaved = Math.round(
    listings
      .filter((l) => l.status === "claimed")
      .reduce((sum, l) => sum + l.quantityValue * 0.4, 0),
  );

  const stats = [
    {
      icon: Package,
      label: "Total Upload",
      value: totalUploads,
      empty: "Belum ada listing · Upload makanan pertamamu! 🍱",
      sub: totalUploads > 0 ? "sepanjang waktu" : undefined,
    },
    {
      icon: TrendingUp,
      label: "Diklaim",
      value: claimed,
      empty: "Belum ada klaim · Listingmu akan muncul di sini 📦",
      sub:
        claimed > 0 && totalUploads > 0
          ? `tingkat sukses ${Math.round((claimed / totalUploads) * 100)}%`
          : undefined,
    },
    {
      icon: Leaf,
      label: "Kg Diselamatkan",
      value: kgSaved,
      empty: "0 kg · Setiap gram yang kamu bagikan dihitung 🌿",
      sub: kgSaved > 0 ? "estimasi" : undefined,
    },
  ];

  const handleAdd = (data: Partial<FoodListing>) => {
    const newL: FoodListing = {
      id: String(Date.now()),
      name: data.name || "Makanan Baru",
      provider: user?.name || "Akun Saya",
      providerType: user?.providerType || "restoran",
      providerRating: 5,
      image: data.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=70",
      quantityValue: data.quantityValue ?? 1,
      quantityUnit: data.quantityUnit ?? "porsi",
      quantity: data.quantity ?? `${data.quantityValue ?? 1} ${data.quantityUnit ?? "porsi"}`,
      expiresAt: new Date(Date.now() + 4 * 3600 * 1000),
      expiryGranularity: data.expiryGranularity,
      distanceKm: 0,
      isFree: data.isFree ?? true,
      price: data.price,
      originalPrice: data.originalPrice,
      location: data.location || "Lokasi saya",
      area: data.area,
      status: "available",
      category: "nasi",
      notes: data.notes,
      minClaim: data.minClaim,
      condition: data.condition,
      requiresConfirmation: data.requiresConfirmation,
    };
    setListings((prev) => [newL, ...prev]);
    toast.success("Listing baru berhasil dipublikasikan!");
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Dashboard Penyedia</span>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">
            Halo, {user?.name?.split(" ")[0] || "Penyedia"} 🌱
          </h1>
          <p className="text-muted-foreground mt-1">Kelola surplus makanan Anda dan lihat dampaknya.</p>
        </div>
        <Button size="lg" variant="hero" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Upload Makanan
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const isEmpty = s.value === 0;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                {s.sub && <span className="text-xs text-muted-foreground">{s.sub}</span>}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
              <p className="font-display text-3xl font-extrabold">{s.value}</p>
              {isEmpty && (
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.empty}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Listing Aktif</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/provider/listings">
              Lihat semua <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
          {listings.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <div className="text-4xl" aria-hidden>📭</div>
              <p className="font-semibold">Kamu belum punya listing aktif</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Mulai bagikan surplus makananmu untuk membantu komunitas sekitar.
              </p>
              <Button variant="hero" onClick={() => setOpen(true)} className="mt-2">
                <Plus className="h-4 w-4" /> Upload Makanan Pertama
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {listings.map((l) => (
                <li key={l.id} className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors">
                  <img src={l.image} alt={l.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate">{l.name}</p>
                      <Badge variant="outline" className={cn("text-xs", statusStyle[l.status])}>
                        {statusLabel[l.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {l.quantity} · {l.location === "private" ? l.area : l.location} ·{" "}
                      {l.isFree ? "Gratis" : `Rp${l.price?.toLocaleString("id-ID")}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <UploadFoodDialog open={open} onOpenChange={setOpen} onSubmit={handleAdd} />
    </div>
  );
};

export default ProviderDashboard;
