import { cn } from "@/lib/utils";
import type { PartsPathStatus } from "@/lenses/compare/types";

const STATUS_STYLES: Record<
  PartsPathStatus,
  { badge: string; dot: string }
> = {
  green: {
    badge: "bg-status-success-muted text-status-success-foreground",
    dot: "bg-status-success",
  },
  yellow: {
    badge: "bg-status-warning-muted text-status-warning-foreground",
    dot: "bg-status-warning",
  },
  red: {
    badge: "bg-status-danger-muted text-status-danger-foreground",
    dot: "bg-status-danger",
  },
};

type PartsPathBadgeProps = {
  status: PartsPathStatus;
  label: string;
};

/** Green, yellow, or red parts path badge using operational colors from theme tokens. */
export function PartsPathBadge({ status, label }: PartsPathBadgeProps): React.ReactElement {
  const styles = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl px-2 py-0.5 text-xs font-medium uppercase",
        styles.badge,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", styles.dot)} aria-hidden />
      {label}
    </span>
  );
}
