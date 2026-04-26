import { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PickupRecord } from "@/lib/mock-data";

interface Props {
  record: PickupRecord | null;
  /** Who is being rated — used in copy */
  target: "provider" | "recipient";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (recordId: string, rating: number, review: string) => void;
}

export const RatingDialog = ({ record, target, open, onOpenChange, onSubmit }: Props) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const reset = () => {
    setRating(0);
    setHover(0);
    setReview("");
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!record || rating === 0) return;
    onSubmit(record.id, rating, review.trim());
    reset();
    onOpenChange(false);
  };

  if (!record) return null;

  const targetLabel = target === "provider" ? "penyedia" : "penerima";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Beri ulasan</DialogTitle>
          <DialogDescription>
            Bagaimana pengalaman Anda dengan {targetLabel} ini? Ulasan Anda membantu komunitas DaurPangan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-2xl border border-border p-3 bg-muted/30">
          <img src={record.image} alt={record.listingName} className="h-14 w-14 rounded-xl object-cover" />
          <div className="min-w-0">
            <p className="font-semibold truncate">{record.listingName}</p>
            <p className="text-xs text-muted-foreground truncate">{record.counterparty} · {record.quantity}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1.5" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((v) => {
                const active = (hover || rating) >= v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRating(v)}
                    onMouseEnter={() => setHover(v)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                    aria-label={`Beri ${v} bintang`}
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition-all",
                        active ? "fill-accent text-accent scale-110" : "text-muted-foreground/40",
                      )}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-muted-foreground">{rating}/5</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Ulasan (opsional)</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Ceritakan pengalaman Anda..."
              rows={4}
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">{review.length}/300</p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => handleClose(false)}>
              Lewati
            </Button>
            <Button type="submit" variant="hero" disabled={rating === 0}>
              Kirim Ulasan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
