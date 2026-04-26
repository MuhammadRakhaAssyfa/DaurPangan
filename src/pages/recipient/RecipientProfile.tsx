import { Mail, Star, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { RoleBadge } from "@/components/RoleBadge";
import { mockRecipientHistory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const RecipientProfile = () => {
  const { user } = useAuth();
  if (!user) return null;

  const reviewed = mockRecipientHistory.filter((r) => r.rated);
  const avgGiven = reviewed.length
    ? (reviewed.reduce((s, r) => s + (r.rating ?? 0), 0) / reviewed.length).toFixed(1)
    : "—";

  const stats = [
    { label: "Pickup", value: String(mockRecipientHistory.length) },
    { label: "Ulasan diberi", value: String(reviewed.length) },
    { label: "Rata-rata", value: avgGiven },
  ];

  return (
    <div className="container py-10">
      <span className="text-xs font-bold tracking-[0.2em] text-accent-foreground uppercase">Profil</span>
      <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Profil Anda</h1>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-warm text-accent-foreground font-display text-3xl font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-2xl font-bold">{user.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RoleBadge role="recipient" />
            </div>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> Jakarta Pusat
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-muted/50 p-4">
              <p className="font-display text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display font-bold text-lg">Ulasan yang Anda beri</h3>
        <div className="mt-3 space-y-3">
          {reviewed.length === 0 && (
            <p className="text-sm text-muted-foreground">Belum ada ulasan.</p>
          )}
          {reviewed.map((r) => (
            <div key={r.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm">{r.counterparty}</p>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Star
                      key={v}
                      className={cn(
                        "h-3.5 w-3.5",
                        (r.rating ?? 0) >= v ? "fill-accent text-accent" : "text-muted-foreground/30",
                      )}
                    />
                  ))}
                </div>
              </div>
              {r.review && <p className="mt-1 text-sm text-muted-foreground italic">"{r.review}"</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipientProfile;
