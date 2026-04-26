import { Mail, Star, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import { RoleBadge } from "@/components/RoleBadge";

const ProviderProfile = () => {
  const { user } = useAuth();
  if (!user) return null;

  const stats = [
    { label: "Rating", value: "4.9", icon: Star },
    { label: "Ulasan", value: "128" },
    { label: "Listing", value: "47" },
    { label: "Kg disalurkan", value: "284" },
  ];

  return (
    <div className="container py-10">
      <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Profil Penyedia</span>
      <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Profil bisnis Anda</h1>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground font-display text-3xl font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-2xl font-bold">{user.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RoleBadge role="provider" />
              {user.providerType && <ProviderTypeBadge type={user.providerType} />}
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

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-muted/50 p-4">
              <p className="font-display text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display font-bold text-lg">Tentang</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Penyedia aktif di komunitas DaurPangan. Berkomitmen mengurangi food waste dan berbagi surplus
          dengan masyarakat sekitar.
        </p>
      </div>
    </div>
  );
};

export default ProviderProfile;
