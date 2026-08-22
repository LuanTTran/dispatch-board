import { cn } from "@/lib/utils";
import { SpatialPopupBadge } from "@/spatial/SpatialPopupBadge";
import type { MapSiteData, MapSiteWorkOrder } from "@/spatial/types";

type SiteWorkOrderPopupProps = {
  site: MapSiteData;
  focusedWorkOrderId: string | null;
  onSelectWorkOrder: (workOrderId: string) => void;
  /** queue-focus means the work order was chosen in the queue. map-pick means the operator chose from a pin click. */
  interactionMode: "queue-focus" | "map-pick";
};

function WorkOrderRow({
  workOrder,
  isFocused,
  onSelect,
  variant,
}: {
  workOrder: MapSiteWorkOrder;
  isFocused: boolean;
  onSelect: () => void;
  variant: "primary" | "selectable" | "secondary";
}): React.ReactElement {
  if (variant === "primary") {
    return (
      <div className="space-y-0.5 rounded-md bg-accent/60 px-2 py-2">
        <p className="font-medium text-foreground">
          {workOrder.workOrderId} · SLA {workOrder.slaLabel}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {workOrder.symptomOneLiner}
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isFocused ? "true" : undefined}
      className={cn(
        "flex w-full flex-col gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors",
        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "secondary" ? "text-sm" : "",
        isFocused ? "bg-accent/60" : "bg-transparent",
      )}
    >
      <span className="font-medium text-foreground">
        {workOrder.workOrderId} · SLA {workOrder.slaLabel}
      </span>
      <span className="line-clamp-2 text-xs text-muted-foreground">
        {workOrder.symptomOneLiner}
      </span>
    </button>
  );
}

/** Site pin popup. Queue focus confirms the work order. Map pin click lists work orders to pick. */
export function SiteWorkOrderPopup({
  site,
  focusedWorkOrderId,
  onSelectWorkOrder,
  interactionMode,
}: SiteWorkOrderPopupProps): React.ReactElement {
  const isMulti = site.workOrders.length > 1;
  const headerLabel = `${site.name} · ${site.city}`;
  const focusedWorkOrder = site.workOrders.find(
    (workOrder) => workOrder.workOrderId === focusedWorkOrderId,
  );
  const otherWorkOrders =
    interactionMode === "queue-focus" && focusedWorkOrder != null
      ? site.workOrders.filter(
          (workOrder) => workOrder.workOrderId !== focusedWorkOrderId,
        )
      : site.workOrders;

  return (
    <div className="min-w-55 space-y-2 text-sm">
      <header className="space-y-1">
        <SpatialPopupBadge label="Site" />
        <p className="font-medium leading-snug text-foreground">{headerLabel}</p>
        {interactionMode === "map-pick" && isMulti ? (
          <p className="text-xs text-muted-foreground">
            {site.workOrders.length} open jobs at this site — select one:
          </p>
        ) : null}
        {interactionMode === "queue-focus" && isMulti && focusedWorkOrder != null ? (
          <p className="text-xs text-muted-foreground">Focused from queue</p>
        ) : null}
      </header>

      {interactionMode === "queue-focus" && focusedWorkOrder != null ? (
        <WorkOrderRow
          workOrder={focusedWorkOrder}
          isFocused
          onSelect={() => undefined}
          variant="primary"
        />
      ) : null}

      {interactionMode === "map-pick" || otherWorkOrders.length > 0 ? (
        <>
          {interactionMode === "queue-focus" && otherWorkOrders.length > 0 ? (
            <div className="border-t border-border pt-2">
              <p className="mb-1 text-xs text-muted-foreground">
                {otherWorkOrders.length} other job
                {otherWorkOrders.length === 1 ? "" : "s"} at this site
              </p>
            </div>
          ) : null}

          {interactionMode === "map-pick" && isMulti ? (
            <div className="border-t border-border" role="separator" />
          ) : null}

          <ul className="space-y-1">
            {(interactionMode === "map-pick" ? site.workOrders : otherWorkOrders).map(
              (workOrder) => (
                <li key={workOrder.workOrderId}>
                  <WorkOrderRow
                    workOrder={workOrder}
                    isFocused={workOrder.workOrderId === focusedWorkOrderId}
                    onSelect={() => onSelectWorkOrder(workOrder.workOrderId)}
                    variant={
                      interactionMode === "queue-focus" ? "secondary" : "selectable"
                    }
                  />
                </li>
              ),
            )}
          </ul>
        </>
      ) : null}
    </div>
  );
}
