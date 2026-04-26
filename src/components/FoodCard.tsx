import { useEffect, useState } from "react";
import { Clock, Footprints, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import { conditionMap, type FoodListing } from "@/lib/mock-data";
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
  const d = Math.floor(diff / 86_400_000);
  return { d, h, m, expired: diff <= 0 };
};

interface Props {
  listing: FoodListing;
  onClaim?: (id: string) => void;
}

export const FoodCard = ({ listing, onClaim }: Props) => {
  const { d, h, m, expired } = useCountdown(listing.expiresAt);
  const urgent = !expired && h < 2 && d === 0;
  const isRumah = listing.providerType === "rumah";
  const isToko = listing.providerType === "toko";
  const isHotel = listing.providerType === "hotel";
  const community = isHotel && listing.quantityValue > 20;
  const showAddress = !isRumah;

  const expiryLabel = expired
    ? "Kedaluwarsa"
    : listing.expiryGranularity === "day"
      ? d > 0 ? `${d}h lagi` : `${h}j lagi`
      : `${h}j ${m}m`;

  const claimLabel = expired
    ? "Kedaluwarsa"
    : isRumah
      ? "Minta"
      : listing.isFree
        ? "Klaim Sekarang"
        : "Beli Sekarang";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-card transition-all hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {listing.isFree || isRumah ? (
            <Badge className="bg-success text-success-foreground border-0 shadow-card font-semibold">GRATIS</Badge>
          ) : (
            <Badge className="bg-accent text-accent-foreground border-0 shadow-card font-semibold">
              {formatRupiah(listing.price ?? 0)}
              {listing.originalPrice && (
                <span className="ml-1 line-through opacity-70 font-normal text-[10px]">
                  {formatRupiah(listing.originalPrice)}
                </span>
              )}
            </Badge>
          )}
          {community && (
            <Badge className="bg-primary text-primary-foreground border-0 shadow-card text-[10px] font-semibold gap-1">
              <Users className="h-3 w-3" /> Cocok untuk komunitas
            </Badge>
          )}
        </div>

        {isRumah && (
          <div className="absolute top-3 right-3 rounded-full bg-foreground/90 text-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-card">
            Homemade
          </div>
        )}
        {!isRumah && (
          <div className={cn(
            "absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-medium shadow-soft",
            urgent && "text-destructive",
          )}>
            <Clock className="h-3 w-3" />
            {expiryLabel}
          </div>
        )}
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

        <div className="flex flex-wrap items-center gap-1.5">
          <ProviderTypeBadge type={listing.providerType} />
          {isToko && listing.condition && (
            <Badge variant="outline" className={cn("text-[10px] font-medium px-2 py-0.5", conditionMap[listing.condition].className)}>
              {conditionMap[listing.condition].label}
            </Badge>
          )}
          {isRumah && (
            <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {expiryLabel}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground gap-2">
          <span className="flex items-center gap-1 min-w-0 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {showAddress
              ? <>{listing.distanceKm} km · {listing.location}</>
              : <span className="truncate">Area {listing.area}</span>}
          </span>
          <span className="font-medium text-foreground shrink-0">
            {listing.quantityValue} {listing.quantityUnit}
          </span>
        </div>

        {!isRumah && listing.walkMinutes && (
          <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <Footprints className="h-3 w-3" /> ± {listing.walkMinutes} mnt jalan kaki
          </div>
        )}

        {listing.minClaim && (
          <p className="text-[11px] font-medium text-accent-foreground bg-accent/10 rounded px-2 py-1">
            Minimum klaim: {listing.minClaim} {listing.quantityUnit}
          </p>
        )}

        <Button
          variant={listing.isFree || isRumah ? "default" : "warm"}
          size="sm"
          className="mt-3 w-full"
          disabled={expired}
          onClick={() => onClaim?.(listing.id)}
        >
          {claimLabel}
        </Button>
      </div>
    </article>
  );
};
