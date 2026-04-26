import { useState } from "react";
import { AlertCircle, Clock, Info, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import type { FoodListing } from "@/lib/mock-data";
import { providerTypeMap } from "@/lib/mock-data";
import { toast } from "sonner";

interface Props {
  listing: FoodListing | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const formatRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

export const ClaimDialog = ({ listing, open, onOpenChange }: Props) => {
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  if (!listing) return null;
  const { providerType } = listing;
  const meta = providerTypeMap[providerType];
  const isRumah = providerType === "rumah";
  const min = listing.minClaim ?? 1;
  const max = listing.quantityValue;

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (qty < 1) return setError("Jumlah harus minimal 1.");
    if (qty > max) return setError(`Stok tersisa hanya ${max} ${listing.quantityUnit}.`);
    if (listing.minClaim && qty < listing.minClaim) {
      return setError(`Minimum klaim ${listing.minClaim} ${listing.quantityUnit}.`);
    }
    if (isRumah) {
      toast.success("Permintaan dikirim. Menunggu konfirmasi penyedia.");
    } else {
      toast.success(`Berhasil mengklaim ${qty} ${listing.quantityUnit} ${listing.name}.`);
    }
    onOpenChange(false);
    setQty(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isRumah ? "Minta makanan ini" : "Klaim makanan"}
          </DialogTitle>
          <DialogDescription>
            {isRumah
              ? "Penyedia rumah tangga akan mengonfirmasi permintaan Anda secara manual sebelum deal."
              : `Tentukan jumlah ${listing.quantityUnit} yang ingin Anda ambil.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 rounded-xl border border-border p-3 bg-muted/30">
          <img src={listing.image} alt={listing.name} className="h-16 w-16 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{listing.name}</p>
            <p className="text-xs text-muted-foreground">{listing.provider}</p>
            <ProviderTypeBadge type={providerType} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Stok: {max} {listing.quantityUnit}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />
            {isRumah ? listing.area : `${listing.distanceKm} km`}
          </span>
        </div>

        {listing.minClaim && (
          <div className="flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/10 p-3 text-xs">
            <Info className="h-4 w-4 text-accent-foreground shrink-0 mt-0.5" />
            <p>Minimum klaim <b>{listing.minClaim} {listing.quantityUnit}</b> — cocok untuk panti sosial atau komunitas.</p>
          </div>
        )}

        {isRumah && (
          <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs">
            <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p>Karena listing ini personal, Anda <b>tidak bisa langsung klaim</b>. {meta.label} akan mengonfirmasi terlebih dahulu.</p>
          </div>
        )}

        <form onSubmit={handleClaim} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qty-claim">Jumlah ({listing.quantityUnit})</Label>
            <Input
              id="qty-claim"
              type="number"
              min={min}
              max={max}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              required
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {!listing.isFree && listing.price && (
            <div className="flex items-center justify-between rounded-xl border border-border p-3 bg-muted/30 text-sm">
              <span className="text-muted-foreground">Total bayar</span>
              <span className="font-semibold">{formatRupiah((listing.price || 0) * qty)}</span>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" variant="hero">
              {isRumah ? "Kirim permintaan" : listing.isFree ? "Klaim sekarang" : "Beli sekarang"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
