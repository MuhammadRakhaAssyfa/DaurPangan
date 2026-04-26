import { useMemo, useState } from "react";
import { Bell, MapPin, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FoodCard } from "@/components/FoodCard";
import { mockListings, mockNotifications } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "Semua" },
  { id: "nasi", label: "Nasi" },
  { id: "roti", label: "Roti" },
  { id: "sayur", label: "Sayur" },
  { id: "buah", label: "Buah" },
  { id: "kue", label: "Kue" },
] as const;

const RecipientHome = () => {
  const [freeOnly, setFreeOnly] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const unread = mockNotifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    return mockListings.filter((l) => {
      if (freeOnly && !l.isFree) return false;
      if (category !== "all" && l.category !== category) return false;
      if (query && !l.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [freeOnly, category, query]);

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-accent-foreground uppercase">Cari Makanan</span>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Makanan terdekat dari Anda</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> Jakarta Pusat · radius 5 km
          </p>
        </div>
        <Button asChild variant="outline" size="lg" className="relative">
          <Link to="/recipient/notifications">
            <Bell className="h-4 w-4" /> Notifikasi
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {unread}
              </span>
            )}
          </Link>
        </Button>
      </div>

      <div className="mt-8 relative overflow-hidden rounded-3xl border border-border shadow-soft h-64 md:h-80">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-soft via-background to-accent/20" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        {filtered.slice(0, 6).map((l, i) => (
          <button
            key={l.id}
            className="absolute group"
            style={{
              top: `${20 + (i * 13) % 60}%`,
              left: `${15 + (i * 19) % 70}%`,
            }}
          >
            <span className="relative flex">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
              <span
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full shadow-elevated text-xs font-bold border-2 border-background",
                  l.isFree ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
                )}
              >
                {l.distanceKm}km
              </span>
            </span>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-foreground text-background text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {l.name}
            </div>
          </button>
        ))}
        <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-background/95 backdrop-blur px-4 py-2 shadow-card text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Gratis
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Diskon
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <Input
            placeholder="Cari makanan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button variant={freeOnly ? "default" : "outline"} onClick={() => setFreeOnly((v) => !v)}>
            <SlidersHorizontal className="h-4 w-4" />
            Hanya Gratis
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Badge
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "cursor-pointer px-4 py-1.5 text-sm border transition-colors",
                category === c.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-muted",
              )}
            >
              {c.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} makanan tersedia</p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">Tidak ada makanan cocok. Coba ubah filter.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <FoodCard
                key={l.id}
                listing={l}
                onClaim={() => toast.success(`Berhasil mengklaim: ${l.name}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientHome;
