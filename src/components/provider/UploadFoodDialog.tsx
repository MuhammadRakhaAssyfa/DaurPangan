import { useState } from "react";
import { Upload } from "lucide-react";
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
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: Partial<FoodListing>) => void;
}

export const UploadFoodDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [isFree, setIsFree] = useState(true);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      quantity,
      location,
      isFree,
      price: isFree ? undefined : Number(price) || 0,
    });
    onOpenChange(false);
    setName(""); setQuantity(""); setLocation(""); setPrice(""); setIsFree(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Upload Makanan Surplus</DialogTitle>
          <DialogDescription>Bagikan surplus Anda agar tidak terbuang.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handle} className="space-y-4 mt-2">
          <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Unggah foto makanan</p>
            <p className="text-xs text-muted-foreground">PNG, JPG (max 5MB)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="food-name">Nama makanan</Label>
            <Input id="food-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nasi box, roti, sayur..." required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="qty">Jumlah</Label>
              <Input id="qty" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="10 porsi" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Batas waktu</Label>
              <Input id="expiry" type="datetime-local" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loc">Lokasi pengambilan</Label>
            <Textarea id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Alamat lengkap" rows={2} required />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-muted/30">
            <div>
              <Label htmlFor="free" className="font-semibold">Gratis</Label>
              <p className="text-xs text-muted-foreground">Bagikan tanpa biaya</p>
            </div>
            <Switch id="free" checked={isFree} onCheckedChange={setIsFree} />
          </div>

          {!isFree && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="price">Harga diskon (Rp)</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5000" />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" variant="hero">Publikasikan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
