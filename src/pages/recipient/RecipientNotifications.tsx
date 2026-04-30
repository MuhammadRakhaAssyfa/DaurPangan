import { Bell, Check, X, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

const timeAgo = (input: Date) => {
  const d = input instanceof Date ? input : new Date(input as unknown as string);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
};

const RecipientNotifications = () => {
  const { items, unread, markAllRead, markRead, dismiss } = useNotifications();

  return (
    <div className="container py-10 max-w-3xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-accent-foreground uppercase">
            Notifikasi
          </span>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Aktivitas terbaru</h1>
          <p className="text-muted-foreground mt-1">
            {items.length === 0
              ? "Belum ada notifikasi"
              : unread > 0
                ? `${unread} notifikasi belum dibaca`
                : "Semua sudah terbaca"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="h-4 w-4" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className="mt-8 space-y-2">
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center gap-2 text-muted-foreground">
            <Inbox className="h-8 w-8" />
            <p>Belum ada notifikasi</p>
            <p className="text-xs">Notifikasi tentang makanan baru akan muncul di sini.</p>
          </div>
        )}
        {items.map((n) => (
          <div
            key={n.id}
            className={cn(
              "group w-full flex items-start gap-4 rounded-2xl border p-4 transition-colors",
              n.read
                ? "border-border bg-card"
                : "border-primary/30 bg-primary-soft/40 hover:bg-primary-soft/60",
            )}
          >
            <button
              onClick={() => markRead(n.id)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
                n.read ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground",
              )}
              aria-label="Tandai dibaca"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={() => markRead(n.id)}
              className="flex-1 min-w-0 text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <p className={cn("font-semibold", !n.read && "text-foreground")}>{n.title}</p>
                <span className="text-xs text-muted-foreground shrink-0">{timeAgo(n.date)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
            </button>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              <button
                onClick={() => dismiss(n.id)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Hapus notifikasi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipientNotifications;
