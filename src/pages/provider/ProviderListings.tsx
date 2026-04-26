import { useMemo, useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, CheckCircle2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type FoodListing, type FoodStatus } from "@/lib/mock-data";
import { UploadFoodDialog } from "@/components/provider/UploadFoodDialog";
import { EditListingDialog } from "@/components/provider/EditListingDialog";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyle: Record<FoodStatus, string> = {
  available: "bg-success/10 text-success border-success/20",
  claimed: "bg-accent/15 text-accent-foreground border-accent/30",
  expired: "bg-muted text-muted-foreground border-border",
};
const statusLabel: Record<FoodStatus, string> = {
  available: "Tersedia",
  claimed: "Diklaim",
  expired: "Kedaluwarsa",
};

const filters: { id: FoodStatus | "all"; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "available", label: "Tersedia" },
  { id: "claimed", label: "Diklaim" },
  { id: "expired", label: "Kedaluwarsa" },
];

const ProviderListings = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FoodStatus | "all">("all");
  // Start empty — new accounts have zero listings.
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [editTarget, setEditTarget] = useState<FoodListing | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? listings : listings.filter((l) => l.status === filter)),
    [filter, listings],
  );

  const handleAdd = (data: Partial<FoodListing>) => {
    const newL: FoodListing = {
      id: String(Date.now()),
      name: data.name || "Makanan Baru",
      provider: user?.name || "Akun Saya",
      providerType: user?.providerType || "restoran",
      providerRating: 5,
      image: data.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=70",
      quantityValue: data.quantityValue ?? 1,
      quantityUnit: data.quantityUnit ?? "porsi",
      quantity: data.quantity ?? `${data.quantityValue ?? 1} ${data.quantityUnit ?? "porsi"}`,
      expiresAt: new Date(Date.now() + 4 * 3600 * 1000),
      expiryGranularity: data.expiryGranularity,
      distanceKm: 0,
      isFree: data.isFree ?? true,
      price: data.price,
      originalPrice: data.originalPrice,
      location: data.location || "Lokasi saya",
      area: data.area,
      status: "available",
      category: "nasi",
      notes: data.notes,
      minClaim: data.minClaim,
      condition: data.condition,
      requiresConfirmation: data.requiresConfirmation,
    };
    setListings((prev) => [newL, ...prev]);
    toast.success("Listing baru berhasil dipublikasikan!");
  };

  const handleDelete = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    toast.success("Listing dihapus");
  };

  const handleMarkOut = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "expired" as FoodStatus } : l)),
    );
    toast.success("Listing ditandai habis");
  };

  const handleEditSave = (id: string, patch: Partial<FoodListing>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    toast.success("Perubahan tersimpan");
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Listing Saya</span>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Kelola listing Anda</h1>
          <p className="text-muted-foreground mt-1">
            {listings.length} listing milik {user?.name || "Anda"}
          </p>
        </div>
        <Button size="lg" variant="hero" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Upload Makanan
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Badge
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "cursor-pointer px-4 py-1.5 text-sm border transition-colors",
              filter === f.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-muted",
            )}
          >
            {f.label}
          </Badge>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
        {listings.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="text-4xl" aria-hidden>📭</div>
            <p className="font-semibold">Kamu belum punya listing aktif</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Mulai bagikan surplus makananmu untuk membantu komunitas sekitar.
            </p>
            <Button variant="hero" onClick={() => setOpen(true)} className="mt-2">
              <Plus className="h-4 w-4" /> Upload Makanan Pertama
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Inbox className="h-8 w-8" />
            <p>Tidak ada listing dengan filter ini.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((l) => (
              <li key={l.id} className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors">
                <img src={l.image} alt={l.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold truncate">{l.name}</p>
                    <Badge variant="outline" className={cn("text-xs", statusStyle[l.status])}>
                      {statusLabel[l.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {l.quantity} · {l.location === "private" ? l.area : l.location} ·{" "}
                    {l.isFree ? "Gratis" : `Rp${l.price?.toLocaleString("id-ID")}`}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0" aria-label="Aksi listing">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => setEditTarget(l)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMarkOut(l.id)}>
                      <CheckCircle2 className="h-4 w-4" /> Tandai Habis
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(l.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        )}
      </div>

      <UploadFoodDialog open={open} onOpenChange={setOpen} onSubmit={handleAdd} />
      <EditListingDialog
        listing={editTarget}
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default ProviderListings;
