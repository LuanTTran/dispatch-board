import { ScrollArea } from "@/components/ui/scroll-area";
import { QueueListItem } from "@/lenses/queue/QueueListItem";
import type { QueueListItemData } from "@/lenses/queue/types";

type QueueListProps = {
  items: QueueListItemData[];
  focusedWorkOrderId: string | null;
  onSelectWorkOrder: (workOrderId: string) => void;
  emptyMessage?: string;
};

/** Scrollable OPEN queue list. Accepts props and emits events without OSDK or filter logic. */
export function QueueList({
  items,
  focusedWorkOrderId,
  onSelectWorkOrder,
  emptyMessage = "No open urgent jobs in Central",
}: QueueListProps): React.ReactElement {
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-panel-padding">
        <p className="text-center text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col py-1" role="list">
        {items.map((item) => (
          <div key={item.workOrderId} role="listitem">
            <QueueListItem
              item={item}
              isFocused={item.workOrderId === focusedWorkOrderId}
              onSelect={onSelectWorkOrder}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
