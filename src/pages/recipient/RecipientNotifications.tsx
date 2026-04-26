import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockNotifications, type RecipientNotification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const timeAgo = (d: Date) => {
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
};

const RecipientNotifications = () => {
  const [items, setItems] = useState<RecipientNotification[]>(mockNotifications);
  const unread = items.filter((n) => !n.read).length;

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const toggle = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="container py-10 max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-accent-foreground uppercase">
            Notifikasi
          </span>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Aktivitas terbaru</h1>
          <p className="text-muted-foreground mt-1">
            {unread > 0 ? `${unread} notifikasi belum dibaca` : "Semua sudah terbaca"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAll}>
            <Check className="h-4 w-4" /> Tandai semua
          </Button>
        )}
      </div>

      <div className="mt-8 space-y-2">
        {items.map((n) => (
          <button
            key={n.id}
            onClick={() => toggle(n.id)}
            className={cn(
              "w-full text-left flex items-start gap-4 rounded-2xl border p-4 transition-colors",
              n.read ? "border-border bg-card" : "border-primary/30 bg-primary-soft/40 hover:bg-primary-soft/60",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
                n.read ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground",
              )}
            >
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={cn("font-semibold", !n.read && "text-foreground")}>{n.title}</p>
                <span className="text-xs text-muted-foreground shrink-0">{timeAgo(n.date)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
            </div>
            {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecipientNotifications;
