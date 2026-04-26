import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { FoodListing } from "@/lib/mock-data";

interface Props {
  listing: FoodListing | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (id: string, patch: Partial<FoodListing>) => void;
}

const toLocalInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

export const EditListingDialog = ({ listing, open, onOpenChange, onSave }: Props) => {
  const isRumah = listing?.providerType === "rumah";
  const isToko = listing?.providerType === "toko";
  const useDayExpiry = listing?.expiryGranularity === "day" || isToko;

  const [image, setImage] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [expiry, setExpiry] = useState("");

  useEffect(() => {
    if (!listing) return;
    setImage(listing.image);
    setQuantityValue(String(listing.quantityValue));
    setQuantityUnit(listing.quantityUnit);
    setIsFree(listing.isFree);
    setPrice(listing.price ? String(listing.price) : "");
    setOriginalPrice(listing.originalPrice ? String(listing.originalPrice) : "");
    setLocation(listing.location === "private" ? "" : listing.location);
    setArea(listing.area || "");
    const d = new Date(listing.expiresAt);
    setExpiry(useDayExpiry ? d.toISOString().slice(0, 10) : toLocalInput(d));
  }, [listing, useDayExpiry]);

  if (!listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantityValue) || 1;
    const expiresAt = expiry ? new Date(expiry) : listing.expiresAt;
    const patch: Partial<FoodListing> = {
      image,
      quantityValue: qty,
      quantityUnit,
      quantity: `${qty} ${quantityUnit}`,
      isFree: isRumah ? true : isFree,
      price: !isFree && !isRumah ? Number(price) || 0 : undefined,
      originalPrice: !isFree && !isRumah ? Number(originalPrice) || undefined : undefined,
      location: isRumah ? "private" : location,
      area: isRumah ? area : listing.area,
      expiresAt,
    };
    onSave(listing.id, patch);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit Listing</DialogTitle>
          <DialogDescription>Perbarui detail untuk "{listing.name}".</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Foto makanan</Label>
            <div className="flex gap-3 items-start">
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                {image ? (
                  <img src={image} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="URL foto"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Tempelkan URL foto baru. Upload langsung tersedia setelah Cloud terhubung.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="qty">Jumlah</Label>
              <Input
                id="qty"
                type="number"
                min={1}
                value={quantityValue}
                onChange={(e) => setQuantityValue(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Satuan</Label>
              <Input
                id="unit"
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
                placeholder="porsi / kg / box"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry">{useDayExpiry ? "Tanggal kedaluwarsa" : "Waktu kedaluwarsa"}</Label>
            <Input
              id="expiry"
              type={useDayExpiry ? "date" : "datetime-local"}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
          </div>

          {isRumah ? (
            <div className="space-y-2">
              <Label htmlFor="area">Area pickup</Label>
              <Input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Kebayoran Baru"
                required
              />
              <p className="text-xs text-muted-foreground">Alamat lengkap dirahasiakan.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="loc">Lokasi pickup</Label>
              <Textarea
                id="loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                rows={2}
                required
              />
            </div>
          )}

          {!isRumah && (
            <>
              <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-muted/30">
                <div>
                  <Label htmlFor="free" className="font-semibold">Gratis</Label>
                  <p className="text-xs text-muted-foreground">Bagikan tanpa biaya</p>
                </div>
                <Switch id="free" checked={isFree} onCheckedChange={setIsFree} />
              </div>

              {!isFree && (
                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="orig">Harga normal (Rp)</Label>
                    <Input
                      id="orig"
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga jual (Rp)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" variant="hero">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
