import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-food.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-40 -left-20 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6 animate-fade-up">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Platform Redistribusi Pangan #1 di Indonesia
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Selamatkan Makanan,
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">Selamatkan Bumi.</span>
          </h1>

          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            Hubungkan surplus makanan dari restoran, hotel, dan katering ke masyarakat yang membutuhkan.
            Kurangi limbah pangan, bagikan kebaikan, jaga lingkungan — semua dalam satu platform.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl" variant="hero" className="font-semibold">
              <Link to="/auth/register?role=provider">
                Daftar sebagai Penyedia
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="font-semibold border-2">
              <Link to="/auth/register?role=recipient">Cari Makanan</Link>
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-primary" />
              12,847 kg makanan diselamatkan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              320+ penyedia aktif
            </span>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative overflow-hidden rounded-3xl shadow-elevated">
            <img
              src={heroImage}
              alt="Makanan surplus dikemas dalam wadah ramah lingkungan untuk dibagikan"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden md:block animate-fade-up [animation-delay:300ms]">
            <div className="rounded-2xl bg-card p-4 shadow-elevated border border-border w-56">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hari ini</p>
                  <p className="font-display font-bold text-lg leading-none">+248 kg</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 hidden md:block animate-fade-up [animation-delay:450ms]">
            <div className="rounded-2xl bg-card px-4 py-3 shadow-elevated border border-border">
              <div className="flex items-center gap-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                <span className="font-medium">5 listing baru di sekitar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
