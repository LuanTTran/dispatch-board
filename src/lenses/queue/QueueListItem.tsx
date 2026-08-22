import { cn } from "@/lib/utils";
import type { QueueListItemData } from "@/lenses/queue/types";

type QueueListItemProps = {
  item: QueueListItemData;
  isFocused: boolean;
  onSelect: (workOrderId: string) => void;
};

const urgencyDotClass: Record<QueueListItemData["urgency"], string> = {
  critical: "bg-status-danger",
  warning: "bg-status-warning",
  normal: "bg-muted-foreground/50",
};

/** Presentational row for one SLA queue item. Parent handles selection. */
export function QueueListItem({
  item,
  isFocused,
  onSelect,
}: QueueListItemProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.workOrderId)}
      aria-current={isFocused ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 border-l-2 px-panel-padding py-2.5 text-left transition-colors",
        "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        isFocused
          ? "border-l-primary bg-accent/50"
          : "border-l-transparent",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full",
          urgencyDotClass[item.urgency],
          isFocused ? "ring-2 ring-primary/40 ring-offset-1 ring-offset-card" : "opacity-70",
        )}
      />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
        {item.workOrderId}
      </span>
      <span
        className={cn(
          "shrink-0 text-xs tabular-nums",
          item.urgency === "critical"
            ? "font-medium text-status-danger-foreground"
            : "text-muted-foreground",
        )}
      >
        {item.slaLabel}
      </span>
    </button>
  );
}
