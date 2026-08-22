import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CompareEmptyState } from "@/lenses/compare/CompareEmptyState";
import { CompareStrip } from "@/lenses/compare/CompareStrip";
import { useTechCompare } from "@/hooks/useTechCompare";
import { PanelHeader } from "@/workspace/PanelHeader";
import { ComparePanelSkeleton } from "@/workspace/skeletons/ComparePanelSkeleton";
import { useWorkspaceSelection } from "@/workspace/WorkspaceSelectionProvider";
import { WorkspacePanel } from "@/workspace/WorkspacePanel";

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
  } = useWorkspaceSelection();

  const { compareTechs, isLoading, error, refetch } = useTechCompare(
    focusedWorkOrderId,
    compareTechnicianIds,
  );

  const hasFocusedWorkOrder = focusedWorkOrderId !== null;
  const showStrip = hasFocusedWorkOrder && compareTechnicianIds.length === 2;

  const selectedCount = compareTechnicianIds.length === 1 ? 1 : 0;

  const showCompareSkeleton = isLoading && showStrip;

  return (
    <WorkspacePanel className={className}>
      <PanelHeader title="Compare" />
      {error != null && showStrip ? (
        <div className="flex flex-1 flex-col gap-3 p-panel-padding">
          <Alert variant="destructive">
            <AlertTitle>Compare data unavailable</AlertTitle>
            <AlertDescription className="text-balance">
              {error.message}
            </AlertDescription>
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
