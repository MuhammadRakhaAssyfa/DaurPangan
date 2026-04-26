import { useMemo, useState } from "react";
import { Bell, MapPin, SlidersHorizontal, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FoodCard } from "@/components/FoodCard";
import { ClaimDialog } from "@/components/ClaimDialog";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import {
  mockListings,
  mockNotifications,
  mockProviders,
  providerTypes,
  type FoodListing,
  type ProviderType,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const typeFilters: { id: ProviderType | "all"; label: string; emoji?: string }[] = [
  { id: "all", label: "Semua" },
  ...providerTypes.map((p) => ({ id: p.id, label: p.label, emoji: p.emoji })),
];

const RecipientHome = () => {
  const [tab, setTab] = useState<"food" | "providers">("food");
  const [freeOnly, setFreeOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<ProviderType | "all">("all");
  const [query, setQuery] = useState("");
  const [providerQuery, setProviderQuery] = useState("");
  const [providerTypeFilter, setProviderTypeFilter] = useState<ProviderType | "all">("all");
  const [claimTarget, setClaimTarget] = useState<FoodListing | null>(null);
  const unread = mockNotifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    return mockListings
      .filter((l) => {
        if (freeOnly && !l.isFree) return false;
        if (typeFilter !== "all" && l.providerType !== typeFilter) return false;
        if (query && !l.name.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [freeOnly, typeFilter, query]);

  const filteredProviders = useMemo(() => {
    return mockProviders.filter((p) => {
      if (providerTypeFilter !== "all" && p.type !== providerTypeFilter) return false;
      if (
        providerQuery &&
        !p.name.toLowerCase().includes(providerQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [providerQuery, providerTypeFilter]);

  // Active listing counts per provider name
  const activeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of mockListings) {
      if (l.status !== "available") continue;
      counts[l.provider] = (counts[l.provider] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-accent-foreground uppercase">
            Cari
          </span>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">
            Temukan makanan & penyedia
          </h1>
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

      <Tabs value={tab} onValueChange={(v) => setTab(v as "food" | "providers")} className="mt-8">
        <TabsList className="h-auto p-1 bg-muted/60">
          <TabsTrigger value="food" className="px-4 py-2 text-sm">
            🍱 Cari Makanan
          </TabsTrigger>
          <TabsTrigger value="providers" className="px-4 py-2 text-sm">
            🏪 Cari Penyedia
          </TabsTrigger>
        </TabsList>

        {/* ========== FOOD TAB ========== */}
        <TabsContent value="food" className="mt-6">
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-soft h-64 md:h-80">
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
            <div className="flex gap-3 items-center flex-wrap">
              <Input
                placeholder="Cari makanan..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="max-w-sm"
              />
              <div className="inline-flex rounded-full border border-border bg-card p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setFreeOnly(false)}
                  className={cn(
                    "px-3 py-1.5 rounded-full font-medium transition-colors",
                    !freeOnly
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Semua Harga
                </button>
                <button
                  type="button"
                  onClick={() => setFreeOnly(true)}
                  className={cn(
                    "px-3 py-1.5 rounded-full font-medium transition-colors inline-flex items-center gap-1.5",
                    freeOnly
                      ? "bg-success text-success-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Gratis Saja
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {typeFilters.map((c) => (
                <Badge
                  key={c.id}
                  onClick={() => setTypeFilter(c.id)}
                  className={cn(
                    "cursor-pointer px-4 py-1.5 text-sm border transition-colors gap-1",
                    typeFilter === c.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-muted",
                  )}
                >
                  {c.emoji && <span aria-hidden>{c.emoji}</span>}
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
                    onClaim={(id) => {
                      const target = filtered.find((x) => x.id === id);
                      if (target) setClaimTarget(target);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ========== PROVIDERS TAB ========== */}
        <TabsContent value="providers" className="mt-6">
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Cari nama restoran, toko, katering..."
              value={providerQuery}
              onChange={(e) => setProviderQuery(e.target.value)}
              className="max-w-md"
            />
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((c) => (
                <Badge
                  key={c.id}
                  onClick={() => setProviderTypeFilter(c.id)}
                  className={cn(
                    "cursor-pointer px-4 py-1.5 text-sm border transition-colors gap-1",
                    providerTypeFilter === c.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-muted",
                  )}
                >
                  {c.emoji && <span aria-hidden>{c.emoji}</span>}
                  {c.label}
                </Badge>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {filteredProviders.length} penyedia ditemukan
          </p>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {filteredProviders.length === 0 ? (
              <div className="sm:col-span-2 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                Tidak ada penyedia cocok.
              </div>
            ) : (
              filteredProviders.map((p) => {
                const active = activeCounts[p.name] || 0;
                const initials = p.name
                  .split(" ")
                  .slice(0, 2)
                  .map((s) => s[0])
                  .join("");
                return (
                  <article
                    key={p.id}
                    className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-card transition-all"
                  >
                    <Avatar className="h-16 w-16 shrink-0 border border-border">
                      <AvatarImage src={p.avatar} alt={p.name} />
                      <AvatarFallback className="font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{p.name}</h3>
                        <ProviderTypeBadge type={p.type} />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {p.area}
                      </p>
                      <div className="mt-1.5 flex items-center gap-3 text-xs">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                          {p.rating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          {active} listing aktif
                        </span>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="mt-2 -ml-2 h-8 text-primary hover:text-primary"
                      >
                        <Link to={`/provider/${p.id}/profile`}>
                          Lihat Profil <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ClaimDialog
        listing={claimTarget}
        open={!!claimTarget}
        onOpenChange={(o) => !o && setClaimTarget(null)}
      />
    </div>
  );
};

export default RecipientHome;
