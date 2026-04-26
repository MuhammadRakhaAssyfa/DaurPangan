import { Link, useLocation } from "react-router-dom";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SiteHeader = () => {
  const { pathname } = useLocation();
  const isAuthRoute = pathname.startsWith("/auth");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-card">
            <Sprout className="h-5 w-5" />
          </span>
          <span>DaurPangan</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#cara-kerja" className="hover:text-foreground transition-colors">Cara Kerja</a>
          <a href="/#dampak" className="hover:text-foreground transition-colors">Dampak</a>
          <Link to="/recipient" className="hover:text-foreground transition-colors">Cari Makanan</Link>
          <Link to="/provider" className="hover:text-foreground transition-colors">Penyedia</Link>
        </nav>

        {!isAuthRoute && (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth/login">Masuk</Link>
            </Button>
            <Button asChild size="sm" variant="hero">
              <Link to="/auth/register">Daftar</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
