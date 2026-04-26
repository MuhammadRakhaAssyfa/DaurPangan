import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProviderHistory, type PickupRecord } from "@/lib/mock-data";
import { RatingDialog } from "@/components/RatingDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(d);

const ProviderHistory = () => {
  const [history, setHistory] = useState<PickupRecord[]>(mockProviderHistory);
  const [active, setActive] = useState<PickupRecord | null>(null);
  const [open, setOpen] = useState(false);

  const handleRate = (rec: PickupRecord) => {
    setActive(rec);
    setOpen(true);
  };

  const handleSubmit = (id: string, rating: number, review: string) => {
    setHistory((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rated: true, rating, review } : r)),
    );
    toast.success("Terima kasih atas ulasan Anda!");
  };

  return (
    <div className="container py-10">
      <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Riwayat</span>
      <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Transaksi sebelumnya</h1>
      <p className="text-muted-foreground mt-1">Riwayat penyaluran makanan Anda.</p>

      <div className="mt-8 space-y-3">
        {history.length === 0 && (
          <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            Belum ada transaksi.
          </p>
        )}
        {history.map((r) => (
          <div
            key={r.id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <img src={r.image} alt={r.listingName} className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold truncate">{r.listingName}</p>
                <Badge variant="outline" className="text-xs">Diterima oleh {r.counterparty}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {r.quantity} · {formatDate(r.date)} · {r.isFree ? "Gratis" : `Rp${r.price?.toLocaleString("id-ID")}`}
              </p>
              {r.rated && r.review && (
                <p className="mt-2 text-sm italic text-muted-foreground">"{r.review}"</p>
              )}
            </div>
            <div className="shrink-0">
              {r.rated ? (
                <div className="flex items-center gap-1 text-sm font-medium">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Star
                      key={v}
                      className={cn(
                        "h-4 w-4",
                        (r.rating ?? 0) >= v ? "fill-accent text-accent" : "text-muted-foreground/30",
                      )}
                    />
                  ))}
                </div>
              ) : (
                <Button variant="hero" size="sm" onClick={() => handleRate(r)}>
                  <Star className="h-4 w-4" /> Beri Ulasan
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <RatingDialog
        record={active}
        target="recipient"
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProviderHistory;
