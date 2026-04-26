import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const RoleBadge = ({ role, className }: { role: Role; className?: string }) => (
  <Badge
    variant="outline"
    className={cn(
      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
      role === "provider"
        ? "bg-primary/10 text-primary border-primary/30"
        : "bg-accent/15 text-accent-foreground border-accent/40",
      className,
    )}
  >
    {role === "provider" ? "Penyedia" : "Penerima"}
  </Badge>
);
