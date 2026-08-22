import { cn } from "@/lib/utils";

type SpatialPopupBadgeProps = {
  label: "Site" | "Technician";
  className?: string;
};

/** Distinguishes site work order popups from read-only technician popups. */
export function SpatialPopupBadge({
  label,
  className,
}: SpatialPopupBadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
