import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DispatchSuccessBanner } from "@/dispatch/DispatchSuccessBanner";
import { CompareEmptyState } from "@/lenses/compare/CompareEmptyState";
import { CompareStrip } from "@/lenses/compare/CompareStrip";
import { useCompareData } from "@/workspace/CompareDataProvider";
import { PanelHeader } from "@/workspace/PanelHeader";
import { WorkspacePanel } from "@/workspace/WorkspacePanel";
import { useWorkspaceSelection } from "@/workspace/WorkspaceSelectionProvider";
import { ComparePanelSkeleton } from "@/workspace/skeletons/ComparePanelSkeleton";

type ComparePanelProps = {
  className?: string;
};

/** Lower-right panel with side-by-side tech compare from shared selection state. */
export function ComparePanel({ className }: ComparePanelProps): React.ReactElement {
  const {
    focusedWorkOrderId,
    compareTechnicianIds,
    assignTargetId,
    selectAssignTarget,
    confirmedDispatch,
  } = useWorkspaceSelection();

  const { compareTechs, isLoading, error, refetch } = useCompareData();

  const hasFocusedWorkOrder = focusedWorkOrderId !== null;
  const showStrip = hasFocusedWorkOrder && compareTechnicianIds.length === 2;

  const selectedCount = compareTechnicianIds.length === 1 ? 1 : 0;

  const dispatchedForFocus =
    confirmedDispatch != null && confirmedDispatch.workOrderId === focusedWorkOrderId
      ? confirmedDispatch
      : null;

  const showCompareSkeleton = isLoading && showStrip && compareTechs.length === 0;

  return (
    <WorkspacePanel className={className}>
      <PanelHeader
        title="Compare"
        action={
          dispatchedForFocus != null ? (
            <Badge
              variant="secondary"
              className="bg-status-success-muted text-status-success-foreground"
            >
              Dispatched
            </Badge>
          ) : undefined
        }
      />
      {dispatchedForFocus != null ? (
        <div className="shrink-0 px-panel-padding pt-panel-padding">
          <DispatchSuccessBanner
            workOrderId={dispatchedForFocus.workOrderId}
            technicianId={dispatchedForFocus.technicianId}
          />
        </div>
      ) : null}
      {error != null && showStrip ? (
        <div className="flex flex-1 flex-col gap-3 p-panel-padding">
          <Alert variant="destructive">
            <AlertTitle>Compare data unavailable</AlertTitle>
            <AlertDescription className="text-balance">{error.message}</AlertDescription>
          </Alert>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : showCompareSkeleton ? (
        <ComparePanelSkeleton />
      ) : showStrip ? (
        <CompareStrip
          techs={compareTechs}
          assignTargetId={assignTargetId}
          dispatchedTechnicianId={dispatchedForFocus?.technicianId ?? null}
          onSelectAssignTarget={selectAssignTarget}
        />
      ) : (
        <CompareEmptyState
          selectedCount={selectedCount}
          hasFocusedWorkOrder={hasFocusedWorkOrder}
        />
      )}
    </WorkspacePanel>
  );
}
