import { Outlet, NavLink, Navigate, useLocation, Link } from "react-router-dom";
import { Sprout, LayoutDashboard, ListChecks, History, User, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/RoleBadge";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { to: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/provider/listings", label: "Listing Saya", icon: ListChecks },
  { to: "/provider/history", label: "Riwayat", icon: History },
  { to: "/provider/profile", label: "Profil", icon: User },
];

export const ProviderLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <Navigate to="/auth/login?role=provider" replace state={{ from: location }} />;
  if (user.role !== "provider") return <Navigate to="/recipient" replace />;

  const handleLogout = () => {
    logout();
    toast.success("Anda telah keluar");
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/provider/dashboard" className="flex items-center gap-2 font-display font-bold text-lg shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-card">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">DaurPangan</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <RoleBadge role="provider" className="hidden sm:inline-flex" />
            {user.providerType && (
              <ProviderTypeBadge type={user.providerType} className="hidden lg:inline-flex" />
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                      isActive ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="mt-1 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
