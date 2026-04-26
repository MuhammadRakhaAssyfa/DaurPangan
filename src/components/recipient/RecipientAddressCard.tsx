import { useEffect, useState } from "react";
import { MapPin, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRecipientAddress } from "@/hooks/use-recipient-address";
import type { RecipientAddress } from "@/lib/mock-data";
import { toast } from "sonner";

const empty: RecipientAddress = {
  fullAddress: "",
  kelurahan: "",
  kecamatan: "",
  kota: "",
  kodePos: "",
};

export const RecipientAddressCard = () => {
  const { address, save } = useRecipientAddress();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<RecipientAddress>(address ?? empty);

  // Keep local form in sync when an external update happens or on first load
  useEffect(() => {
    if (!editing) setForm(address ?? empty);
  }, [address, editing]);

  const update = (k: keyof RecipientAddress, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullAddress.trim() || !form.kota.trim()) {
      toast.error("Alamat lengkap dan kota wajib diisi.");
      return;
    }
    save(form);
    setEditing(false);
    toast.success("Alamat tersimpan.");
  };

  // ============ Empty state ============
  if (!address && !editing) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-soft">
        <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Belum ada alamat tersimpan · Tambahkan alamat untuk mempermudah proses klaim 📍
        </p>
        <Button
          type="button"
          variant="hero"
          size="sm"
          className="mt-4"
          onClick={() => setEditing(true)}
        >
          + Tambah Alamat
        </Button>
      </div>
    );
  }

  // ============ Saved (read-only) ============
  if (address && !editing) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold">Alamat tersimpan</p>
              <p className="mt-1 text-sm text-foreground">{address.fullAddress}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {address.kelurahan && `${address.kelurahan}, `}
                {address.kecamatan && `${address.kecamatan}, `}
                {address.kota} {address.kodePos}
              </p>
            </div>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        </div>
      </div>
    );
  }

  // ============ Edit form ============
  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-bold text-lg">
          {address ? "Edit alamat" : "Tambah alamat"}
        </h3>
        {address && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => {
              setForm(address);
              setEditing(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="addr-full">Alamat lengkap *</Label>
        <Textarea
          id="addr-full"
          placeholder="Jl. Sudirman No. 10, RT 03 / RW 05"
          value={form.fullAddress}
          onChange={(e) => update("fullAddress", e.target.value.slice(0, 200))}
          required
          className="min-h-[72px]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="addr-kel">Kelurahan</Label>
          <Input
            id="addr-kel"
            value={form.kelurahan}
            onChange={(e) => update("kelurahan", e.target.value.slice(0, 60))}
            placeholder="Kebon Sirih"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addr-kec">Kecamatan</Label>
          <Input
            id="addr-kec"
            value={form.kecamatan}
            onChange={(e) => update("kecamatan", e.target.value.slice(0, 60))}
            placeholder="Menteng"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addr-kota">Kota *</Label>
          <Input
            id="addr-kota"
            value={form.kota}
            onChange={(e) => update("kota", e.target.value.slice(0, 60))}
            placeholder="Jakarta Pusat"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addr-pos">Kode pos</Label>
          <Input
            id="addr-pos"
            value={form.kodePos}
            onChange={(e) => update("kodePos", e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="10110"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {address && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setForm(address);
              setEditing(false);
            }}
          >
            Batal
          </Button>
        )}
        <Button type="submit" variant="hero">
          <Save className="h-4 w-4" /> Simpan Alamat
        </Button>
      </div>
    </form>
  );
};
