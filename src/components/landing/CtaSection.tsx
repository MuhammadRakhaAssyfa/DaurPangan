import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CtaSection = () => {
  return (
    <section className="container py-16 md:py-24">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-10 shadow-card">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-soft" />
          <div className="relative">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Untuk Penyedia</span>
            <h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">Punya makanan surplus?</h3>
            <p className="mt-3 text-muted-foreground">
              Restoran, hotel, katering — bagikan surplus Anda dalam hitungan detik. Kurangi food waste, dapatkan dampak sosial nyata.
            </p>
            <Button asChild size="lg" variant="hero" className="mt-6">
              <Link to="/auth/register?role=provider">
                Daftar sebagai Penyedia <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-warm p-8 md:p-10 shadow-card text-accent-foreground">
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-background/20" />
          <div className="relative">
            <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">Untuk Penerima</span>
            <h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">Cari makanan terdekat</h3>
            <p className="mt-3 opacity-90">
              Temukan makanan gratis atau diskon dari penyedia di sekitar Anda. Cepat, mudah, dan ramah lingkungan.
            </p>
            <Button asChild size="lg" className="mt-6 bg-foreground text-background hover:bg-foreground/90">
              <Link to="/auth/register?role=recipient">
                Cari Makanan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
