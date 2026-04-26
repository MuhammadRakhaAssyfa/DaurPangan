import { Badge } from "@/components/ui/badge";
import { providerTypeMap, type ProviderType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface Props {
  type: ProviderType;
  className?: string;
  showEmoji?: boolean;
}

export const ProviderTypeBadge = ({ type, className, showEmoji = true }: Props) => {
  const meta = providerTypeMap[type];
  if (!meta) return null;
  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium gap-1 px-2 py-0.5", meta.badgeClass, className)}
    >
      {showEmoji && <span aria-hidden>{meta.emoji}</span>}
      {meta.label}
    </Badge>
  );
};
