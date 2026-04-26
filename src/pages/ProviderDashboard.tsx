import { useState } from "react";
import { Plus, Package, Leaf, TrendingUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/SiteHeader";
import { mockListings, type FoodListing } from "@/lib/mock-data";
import { UploadFoodDialog } from "@/components/provider/UploadFoodDialog";
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
  const [open, setOpen] = useState(false);
  const [listings, setListings] = useState<FoodListing[]>(
    mockListings.slice(0, 4).map((l, i) => ({
      ...l,
      status: i === 1 ? "claimed" : i === 3 ? "expired" : "available",
    })),
  );

  const stats = [
    { icon: Package, label: "Total Upload", value: "47", sub: "bulan ini" },
    { icon: TrendingUp, label: "Diklaim", value: "39", sub: "tingkat sukses 83%" },
    { icon: Leaf, label: "Kg Diselamatkan", value: "284", sub: "estimasi" },
  ];

  const handleAdd = (data: Partial<FoodListing>) => {
    const newL: FoodListing = {
      id: String(Date.now()),
      name: data.name || "Makanan Baru",
      provider: "Akun Saya",
      providerRating: 5,
      image: data.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=70",
      quantity: data.quantity || "1 porsi",
      expiresAt: new Date(Date.now() + 4 * 3600 * 1000),
      distanceKm: 0,
      isFree: data.isFree ?? true,
      price: data.price,
      location: data.location || "Lokasi saya",
      status: "available",
      category: "nasi",
    };
    setListings((prev) => [newL, ...prev]);
    toast.success("Listing baru berhasil dipublikasikan!");
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main className="container py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Dashboard Penyedia</span>
            <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Selamat datang kembali 🌱</h1>
            <p className="text-muted-foreground mt-1">Kelola surplus makanan Anda dan lihat dampaknya.</p>
          </div>
          <Button size="lg" variant="hero" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Upload Makanan
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground">{s.sub}</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
              <p className="font-display text-3xl font-extrabold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Listing Aktif</h2>
            <p className="text-sm text-muted-foreground">{listings.length} item</p>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
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
                      {l.quantity} · {l.location} · {l.isFree ? "Gratis" : `Rp${l.price?.toLocaleString("id-ID")}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <UploadFoodDialog open={open} onOpenChange={setOpen} onSubmit={handleAdd} />
    </div>
  );
};

export default ProviderDashboard;
