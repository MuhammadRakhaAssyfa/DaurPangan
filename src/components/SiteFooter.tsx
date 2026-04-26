import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border/60 bg-surface mt-24">
      <div className="container py-12 grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground">
              <Sprout className="h-4 w-4" />
            </span>
            DaurPangan
          </Link>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">
            Selamatkan makanan, selamatkan bumi. Bersama mengurangi limbah pangan di Indonesia.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/recipient" className="hover:text-foreground">Cari Makanan</Link></li>
            <li><Link to="/provider" className="hover:text-foreground">Jadi Penyedia</Link></li>
            <li><a href="#dampak" className="hover:text-foreground">Dampak Kami</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Sumber Daya</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Panduan Penyedia</a></li>
            <li><a href="#" className="hover:text-foreground">FAQ</a></li>
            <li><a href="#" className="hover:text-foreground">Kontak</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Komunitas</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Instagram</a></li>
            <li><a href="#" className="hover:text-foreground">Twitter</a></li>
            <li><a href="#" className="hover:text-foreground">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} DaurPangan. Dibuat dengan ❤️ untuk Indonesia.</p>
          <p>Selamatkan Makanan, Selamatkan Bumi 🌱</p>
        </div>
      </div>
    </footer>
  );
};
