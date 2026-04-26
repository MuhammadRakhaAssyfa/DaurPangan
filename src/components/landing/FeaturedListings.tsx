import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/FoodCard";
import { mockListings } from "@/lib/mock-data";

export const FeaturedListings = () => {
  return (
    <section className="container py-20 md:py-24">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Tersedia Sekarang</span>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Makanan di sekitar Anda</h2>
        </div>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/recipient">
            Lihat semua <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockListings.slice(0, 6).map((l) => (
          <FoodCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
};
