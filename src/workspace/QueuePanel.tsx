import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOpenWorkOrders } from "@/hooks/useOpenWorkOrders";
import { QueueList } from "@/lenses/queue/QueueList";
import { PanelHeader } from "@/workspace/PanelHeader";
import { QueueListSkeleton } from "@/workspace/skeletons/QueueListSkeleton";
import { useWorkspaceSelection } from "@/workspace/WorkspaceSelectionProvider";
import { WorkspacePanel } from "@/workspace/WorkspacePanel";

type QueuePanelProps = {
  className?: string;
};

/** Left column with the OPEN queue loaded from Foundry via useOpenWorkOrders. */
export function QueuePanel({ className }: QueuePanelProps): React.ReactElement {
  const { items, isLoading, error, refetch, sourceCount } = useOpenWorkOrders();
  const { focusedWorkOrderId, setFocusedWorkOrderId } = useWorkspaceSelection();

  return (
    <WorkspacePanel className={className}>
      <PanelHeader
        title="OPEN"
        action={
          isLoading ? (
            <Skeleton className="h-5 w-8 rounded-full" />
          ) : (
            <Badge variant="secondary" className="tabular-nums">
              {items.length}
            </Badge>
          )
        }
      />
      {error != null ? (
        <div className="flex flex-1 flex-col gap-3 p-panel-padding">
          <Alert variant="destructive">
            <AlertTitle>Foundry connection failed</AlertTitle>
            <AlertDescription className="text-balance">
              {error.message}
            </AlertDescription>
          </Alert>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <QueueListSkeleton />
      ) : (
        <>
          {sourceCount > 0 ? (
            <p className="border-b border-border px-panel-padding py-1.5 text-xs text-muted-foreground">
              Connected — {sourceCount} work order{sourceCount === 1 ? "" : "s"} from ontology
            </p>
          ) : null}
          <QueueList
            items={items}
            focusedWorkOrderId={focusedWorkOrderId}
            onSelectWorkOrder={(workOrderId) =>
              setFocusedWorkOrderId(workOrderId, { source: "queue" })
            }
            emptyMessage="No unassigned urgent jobs in Central — check ontology seed data"
          />
        </>
      )}
    </WorkspacePanel>
  );
}
