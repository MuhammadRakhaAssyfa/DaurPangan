import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FoodListing, ProductCondition, ProviderType } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: Partial<FoodListing>) => void;
}

const unitOptionsByType: Record<ProviderType, string[]> = {
  restoran: ["porsi"],
  hotel: ["porsi", "box", "tray"],
  toko: ["kg", "ikat", "buah", "bungkus"],
  rumah: ["porsi", "wadah", "toples"],
};

const namePlaceholderByType: Record<ProviderType, string> = {
  restoran: "Nasi Ayam Bakar Sisa Makan Siang",
  hotel: "Nasi Box Acara Konferensi",
  toko: "Sayur Bayam Segar / Roti Tawar Hampir Expired",
  rumah: "Soto Ayam Buatan Sendiri",
};

export const UploadFoodDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const { user } = useAuth();
  const providerType: ProviderType = user?.providerType || "restoran";
  const units = unitOptionsByType[providerType];

  // Rumah tangga can only post free
  const canCharge = providerType !== "rumah";
  const photoRequired = providerType !== "rumah";
  const useDayExpiry = providerType === "toko";

  const [isFree, setIsFree] = useState(true);
  const [name, setName] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [quantityUnit, setQuantityUnit] = useState(units[0]);
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [minClaim, setMinClaim] = useState("");
  const [condition, setCondition] = useState<ProductCondition>("segar");

  const reset = () => {
    setName(""); setQuantityValue(""); setQuantityUnit(units[0]);
    setLocation(""); setArea(""); setOriginalPrice(""); setPrice("");
    setNotes(""); setMinClaim(""); setCondition("segar"); setIsFree(true);
  };

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantityValue) || 1;
    const data: Partial<FoodListing> = {
      name,
      quantityValue: qty,
      quantityUnit,
      quantity: `${qty} ${quantityUnit}`,
      location: providerType === "rumah" ? "private" : location,
      area: providerType === "rumah" ? area : undefined,
      isFree: canCharge ? isFree : true,
      price: canCharge && !isFree ? Number(price) || 0 : undefined,
      originalPrice: canCharge && !isFree ? Number(originalPrice) || undefined : undefined,
      notes: notes || undefined,
      minClaim: providerType === "hotel" && minClaim ? Number(minClaim) : undefined,
      condition: providerType === "toko" ? condition : undefined,
      expiryGranularity: useDayExpiry ? "day" : "hour",
      requiresConfirmation: providerType === "rumah",
    };
    onSubmit(data);
    onOpenChange(false);
    reset();
  };

  const dialogTitle = useMemo(() => {
    switch (providerType) {
      case "hotel": return "Upload Paket Makanan";
      case "toko": return "Upload Produk Surplus";
      case "rumah": return "Bagikan Makanan Buatan";
      default: return "Upload Makanan Surplus";
    }
  }, [providerType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{dialogTitle}</DialogTitle>
          <DialogDescription>
            {providerType === "rumah"
              ? "Bagikan masakan rumahan Anda. Alamat lengkap dirahasiakan."
              : "Bagikan surplus Anda agar tidak terbuang."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handle} className="space-y-4 mt-2">
          <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">
              Unggah foto makanan {photoRequired ? <span className="text-destructive">*</span> : <span className="text-muted-foreground font-normal">(opsional)</span>}
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG (max 5MB)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="food-name">Nama {providerType === "toko" ? "produk" : "makanan"}</Label>
            <Input
              id="food-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={namePlaceholderByType[providerType]}
              maxLength={120}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="qty">Jumlah</Label>
              <div className="flex gap-2">
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  value={quantityValue}
                  onChange={(e) => setQuantityValue(e.target.value)}
                  placeholder="10"
                  required
                />
                <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">{useDayExpiry ? "Tanggal expired" : "Jam expired"}</Label>
              <Input id="expiry" type={useDayExpiry ? "date" : "datetime-local"} required />
            </div>
          </div>

          {providerType === "toko" && (
            <div className="space-y-2">
              <Label>Kondisi produk</Label>
              <Select value={condition} onValueChange={(v) => setCondition(v as ProductCondition)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="segar">Segar</SelectItem>
                  <SelectItem value="mendekati">Mendekati expired</SelectItem>
                  <SelectItem value="sisa">Sisa display</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {providerType === "hotel" && (
            <div className="space-y-2">
              <Label htmlFor="min">Minimum klaim (opsional)</Label>
              <Input
                id="min"
                type="number"
                min={1}
                value={minClaim}
                onChange={(e) => setMinClaim(e.target.value)}
                placeholder="10 — cocok untuk panti/komunitas"
              />
            </div>
          )}

          {providerType === "rumah" ? (
            <div className="space-y-2">
              <Label htmlFor="area">Area pickup (kelurahan/kecamatan)</Label>
              <Input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Kebayoran Baru"
                maxLength={80}
                required
              />
              <p className="text-xs text-muted-foreground">Alamat lengkap tidak akan ditampilkan demi privasi.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="loc">Lokasi pickup</Label>
              <Textarea
                id="loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Alamat lengkap"
                rows={2}
                maxLength={200}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan tambahan (opsional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={providerType === "rumah" ? "Bisa diantar radius 1km" : "Mengandung kacang, halal, dll"}
              rows={2}
              maxLength={200}
            />
          </div>

          {canCharge ? (
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
                    <Input id="orig" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="25000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga jual (Rp)</Label>
                    <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5000" required />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-border p-4 bg-success/5 text-sm">
              <p className="font-semibold text-success">Gratis</p>
              <p className="text-xs text-muted-foreground mt-1">Penyedia rumah tangga hanya bisa membagikan makanan secara cuma-cuma.</p>
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
