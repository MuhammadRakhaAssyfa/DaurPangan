import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Leaf, Package, Users, MessageSquare, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import { FoodCard } from "@/components/FoodCard";
import { ClaimDialog } from "@/components/ClaimDialog";
import {
  mockListings,
  providerProfileMap,
  type FoodListing,
} from "@/lib/mock-data";

const formatDate = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const ProviderPublicProfile = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const profile = providerProfileMap[id];
  const [claimTarget, setClaimTarget] = useState<FoodListing | null>(null);

  const activeListings = useMemo(
    () =>
      profile
        ? mockListings.filter(
            (l) => l.provider === profile.name && l.status === "available",
          )
        : [],
    [profile],
  );

  if (!profile) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Penyedia tidak ditemukan.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("");

  const statCards = [
    {
      icon: Leaf,
      label: "Kg Diselamatkan",
      value: profile.impact.kgSaved,
      empty: "0 kg · Mulai berbagi untuk mencatat dampakmu 🌿",
    },
    {
      icon: Package,
      label: "Total Upload",
      value: profile.impact.totalUploads,
      empty: "0 · Belum ada listing yang dibagikan 📦",
    },
    {
      icon: Users,
      label: "Penerima Terbantu",
      value: profile.impact.recipientsHelped,
      empty: "0 · Belum ada penerima 👥",
    },
  ];

  const reviewsToShow = profile.reviews.slice(0, 5);

  return (
    <div className="container py-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Button>

      {/* HEADER */}
      <section className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-border">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl md:text-3xl font-bold">{profile.name}</h1>
              <ProviderTypeBadge type={profile.type} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {profile.area}
            </p>
            <p className="mt-2 text-sm font-medium flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-accent text-accent" />
              {profile.rating.toFixed(1)}
              <span className="text-muted-foreground font-normal">
                · {profile.totalReviews} ulasan
              </span>
            </p>
            <p className="mt-3 text-sm text-foreground/80 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Dampak yang Sudah Dibuat</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {statCards.map((s) => {
            const isEmpty = s.value === 0;
            return (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
                <p className="font-display text-3xl font-extrabold">{s.value}</p>
                {isEmpty && (
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.empty}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ACTIVE LISTINGS */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Makanan Tersedia Sekarang</h2>
        {activeListings.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Inbox className="h-8 w-8" />
            <p>Belum ada listing aktif saat ini 📭</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeListings.map((l) => (
              <FoodCard key={l.id} listing={l} onClaim={() => setClaimTarget(l)} />
            ))}
          </div>
        )}
      </section>

      {/* REVIEWS */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Ulasan Penerima</h2>
        {reviewsToShow.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            <p>Belum ada ulasan 💬</p>
          </div>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {reviewsToShow.map((r) => (
                <li
                  key={r.id}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback>{r.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{r.authorName}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(r.date)}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < r.rating
                              ? "h-3.5 w-3.5 fill-accent text-accent"
                              : "h-3.5 w-3.5 text-muted-foreground/40"
                          }
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{r.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
            {profile.reviews.length > 5 && (
              <div className="mt-4 text-center">
                <Button asChild variant="ghost" size="sm">
                  <Link to="#">Lihat semua ulasan</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      <ClaimDialog
        listing={claimTarget}
        open={!!claimTarget}
        onOpenChange={(o) => !o && setClaimTarget(null)}
      />
    </div>
  );
};

export default ProviderPublicProfile;
