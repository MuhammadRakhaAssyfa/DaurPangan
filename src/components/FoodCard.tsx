import { useEffect, useState } from "react";
import { Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import type { FoodListing } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const formatRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

const useCountdown = (target: Date) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return { h, m, expired: diff <= 0 };
};

interface Props {
  listing: FoodListing;
  onClaim?: (id: string) => void;
}

export const FoodCard = ({ listing, onClaim }: Props) => {
  const { h, m, expired } = useCountdown(listing.expiresAt);
  const urgent = h < 2;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-card transition-all hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          {listing.isFree ? (
            <Badge className="bg-success text-success-foreground border-0 shadow-card font-semibold">GRATIS</Badge>
          ) : (
            <Badge className="bg-accent text-accent-foreground border-0 shadow-card font-semibold">
              {formatRupiah(listing.price ?? 0)}
            </Badge>
          )}
        </div>
        <div className={cn(
          "absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-medium shadow-soft",
          urgent && "text-destructive",
        )}>
          <Clock className="h-3 w-3" />
          {expired ? "Kedaluwarsa" : `${h}j ${m}m`}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-base leading-tight">{listing.name}</h3>
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground shrink-0">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {listing.providerRating}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{listing.provider}</p>
        <ProviderTypeBadge type={listing.providerType} className="self-start" />

        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {listing.distanceKm} km · {listing.location}
          </span>
          <span className="font-medium text-foreground">{listing.quantity}</span>
        </div>

        <Button
          variant={listing.isFree ? "default" : "warm"}
          size="sm"
          className="mt-3 w-full"
          disabled={expired}
          onClick={() => onClaim?.(listing.id)}
        >
          {expired ? "Kedaluwarsa" : listing.isFree ? "Klaim Sekarang" : "Beli Sekarang"}
        </Button>
      </div>
    </article>
  );
};
