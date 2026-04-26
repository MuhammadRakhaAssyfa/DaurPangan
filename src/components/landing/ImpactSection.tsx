import { impactStats } from "@/lib/mock-data";
import { Leaf, Store, Users, Utensils } from "lucide-react";

const items = [
  { icon: Leaf, label: "Kg Makanan Diselamatkan", value: impactStats.kgSaved.toLocaleString("id-ID"), suffix: "kg" },
  { icon: Store, label: "Penyedia Terdaftar", value: impactStats.providers.toLocaleString("id-ID"), suffix: "+" },
  { icon: Users, label: "Penerima Terbantu", value: impactStats.recipients.toLocaleString("id-ID"), suffix: "+" },
  { icon: Utensils, label: "Porsi Terdistribusi", value: impactStats.meals.toLocaleString("id-ID"), suffix: "" },
];

export const ImpactSection = () => {
  return (
    <section id="dampak" className="relative py-20 md:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-14 shadow-elevated">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-primary-glow/40 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-primary-foreground/80 uppercase">Dampak Kami</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary-foreground md:text-5xl">
              Bersama, kita menciptakan perubahan
            </h2>
            <p className="mt-3 text-primary-foreground/85 md:text-lg">
              Setiap porsi yang diselamatkan adalah satu langkah lebih dekat menuju Indonesia tanpa lapar dan tanpa limbah.
            </p>
          </div>

          <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) => (
              <div
                key={it.label}
                className="rounded-2xl bg-background/95 backdrop-blur p-5 shadow-card border border-background/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-3xl font-extrabold tracking-tight">
                  {it.value}
                  <span className="text-accent">{it.suffix}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{it.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
