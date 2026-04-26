import { useMemo, useState } from "react";
import { Star, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockListings, providerTypes, type ProviderType } from "@/lib/mock-data";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import { cn } from "@/lib/utils";

const filters: { id: ProviderType | "all"; label: string; emoji?: string }[] = [
  { id: "all", label: "Semua" },
  ...providerTypes.map((p) => ({ id: p.id, label: p.label, emoji: p.emoji })),
];

const ProviderMarketplace = () => {
  const [filter, setFilter] = useState<ProviderType | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? mockListings : mockListings.filter((l) => l.providerType === filter)),
    [filter],
  );

  return (
    <div className="container py-10">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Marketplace</span>
        <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Lihat semua listing</h1>
        <p className="text-muted-foreground mt-1 max-w-xl">
          Tampilan baca-saja dari seluruh penyedia di DaurPangan. Dapatkan inspirasi dari listing penyedia lain.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Badge
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "cursor-pointer px-4 py-1.5 text-sm border transition-colors gap-1",
              filter === f.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-muted",
            )}
          >
            {f.emoji && <span aria-hidden>{f.emoji}</span>}
            {f.label}
          </Badge>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {filtered.length} listing ditemukan
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l) => (
          <article
            key={l.id}
            className={cn(
              "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-card transition-all",
              "border-l-4",
              l.providerType === "restoran" && "border-l-[hsl(var(--provider-restoran))]",
              l.providerType === "hotel" && "border-l-[hsl(var(--provider-hotel))]",
              l.providerType === "toko" && "border-l-[hsl(var(--provider-toko))]",
              l.providerType === "rumah" && "border-l-[hsl(var(--provider-rumah))]",
            )}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={l.image}
                alt={l.name}
                loading="lazy"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                {l.isFree ? (
                  <Badge className="bg-success text-success-foreground border-0 shadow-card font-semibold">
                    GRATIS
                  </Badge>
                ) : (
                  <Badge className="bg-accent text-accent-foreground border-0 shadow-card font-semibold">
                    Rp{l.price?.toLocaleString("id-ID")}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold text-base leading-tight">{l.name}</h3>
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground shrink-0">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  {l.providerRating}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{l.provider}</p>

              <div className="flex flex-wrap items-center gap-1.5">
                <ProviderTypeBadge type={l.providerType} />
              </div>

              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground gap-2">
                <span className="flex items-center gap-1 min-w-0 truncate">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {l.providerType === "rumah" ? l.area : l.location}
                  </span>
                </span>
                <span className="font-medium text-foreground shrink-0">
                  {l.quantityValue} {l.quantityUnit}
                </span>
              </div>

              <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {l.expiresAt.toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="mt-3 text-center text-xs font-medium text-muted-foreground bg-muted/60 rounded-md py-2">
                Tampilan baca-saja
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProviderMarketplace;
