import { useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ActionBar } from "@/dispatch/ActionBar";
import { ConfirmDispatchDialog } from "@/dispatch/ConfirmDispatchDialog";
import { HoldWorkOrderDialog } from "@/dispatch/HoldWorkOrderDialog";
import { TechCandidateList } from "@/dispatch/TechCandidateList";
import type { HoldWorkOrderPayload, TechCandidateData } from "@/dispatch/types";
import { useConfirmDispatch } from "@/hooks/useConfirmDispatch";
import { useHoldWorkOrder } from "@/hooks/useHoldWorkOrder";
import { useSelectedTechCompare } from "@/hooks/useSelectedTechCompare";
import { JobCardHeader } from "@/lenses/operations/JobCardHeader";
import { JobDetailsExpander } from "@/lenses/operations/JobDetailsExpander";
import type { JobCardData } from "@/lenses/operations/types";
import { buildConfirmDispatchActionParams } from "@/utils/dispatch/buildConfirmDispatchActionParams";
import { buildConfirmPayload } from "@/utils/dispatch/buildConfirmPayload";
import { formatActionValidationError } from "@/utils/dispatch/formatActionValidationError";
import { useWorkspaceSelection } from "@/workspace/WorkspaceSelectionProvider";
import { useFocusedJob } from "@/hooks/useFocusedJob";
import { useTechCandidates } from "@/hooks/useTechCandidates";
import { OperationsEmptyState } from "@/lenses/operations/OperationsEmptyState";
import { PanelHeader } from "@/workspace/PanelHeader";
import { OperationsPanelSkeleton } from "@/workspace/skeletons/OperationsPanelSkeleton";
import { WorkspacePanel } from "@/workspace/WorkspacePanel";

type OperationsJobContentProps = {
  focusedJob: JobCardData;
  candidates: TechCandidateData[];
};

/** Job card and tech list. Compare selection is managed by WorkspaceSelectionProvider. */
function OperationsJobContent({
  focusedJob,
  candidates,
}: OperationsJobContentProps): React.ReactElement {
  const [jobDetailsExpanded, setJobDetailsExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [concurrencyError, setConcurrencyError] = useState<string | null>(null);
  const [holdError, setHoldError] = useState<string | null>(null);

  const {
    compareTechnicianIds,
    toggleCompareTechnician,
    selectedTechnicianId,
    setFocusedWorkOrderId,
  } = useWorkspaceSelection();

  const {
    compareTech,
    topPrediction,
    jobsLeft,
    hasConfirmedAssignmentToday,
    isLoading: compareLoading,
  } = useSelectedTechCompare(focusedJob.workOrderId, selectedTechnicianId);

  const { confirmDispatch, isPending: confirmPending } = useConfirmDispatch();
  const { holdWorkOrder, isPending: holdPending } = useHoldWorkOrder();

  const confirmPayload = useMemo(() => {
    if (compareTech == null) {
      return null;
    }

    return buildConfirmPayload(focusedJob, compareTech, topPrediction);
  }, [compareTech, focusedJob, topPrediction]);

  const holdPayload = useMemo<HoldWorkOrderPayload>(
    () => ({
      workOrderId: focusedJob.workOrderId,
      symptomOneLiner: focusedJob.symptom,
    }),
    [focusedJob],
  );

  const assignDisabled =
    selectedTechnicianId === null ||
    compareLoading ||
    jobsLeft === 0;

  const handleAssign = (): void => {
    setConcurrencyError(null);
    setConfirmOpen(true);
  };

  const handleHold = (): void => {
    setHoldError(null);
    setHoldOpen(true);
  };

  const handleConfirmDispatch = async (values: {
    overrideReason: string;
    acknowledged: boolean;
  }): Promise<void> => {
    if (confirmPayload === null) {
      return;
    }

    setConcurrencyError(null);

    try {
      await confirmDispatch(
        buildConfirmDispatchActionParams(confirmPayload, values.overrideReason),
      );
      setConfirmOpen(false);
      setFocusedWorkOrderId(null);
    } catch (error) {
      setConcurrencyError(formatActionValidationError(error));
    }
  };

  const handleHoldWorkOrder = async (note: string): Promise<void> => {
    setHoldError(null);

    try {
      await holdWorkOrder({
        workOrderId: focusedJob.workOrderId,
        reason: "parts_pick",
        note: note.length > 0 ? note : undefined,
      });
      setHoldOpen(false);
      setFocusedWorkOrderId(null);
    } catch (error) {
      setHoldError(formatActionValidationError(error));
    }
  };

  const assignLabel =
    selectedTechnicianId !== null ? `Assign ${selectedTechnicianId}` : "Assign";

  return (
    <>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-panel-padding">
          <JobCardHeader job={focusedJob} />
          <Separator />
          <JobDetailsExpander
            details={focusedJob.details}
            expanded={jobDetailsExpanded}
            onExpandedChange={setJobDetailsExpanded}
          />
          <TechCandidateList
            candidates={candidates}
            selectedIds={compareTechnicianIds}
            onToggle={toggleCompareTechnician}
          />
          {hasConfirmedAssignmentToday && selectedTechnicianId !== null ? (
            <Alert variant="default">
              <AlertTitle>Already dispatched today</AlertTitle>
              <AlertDescription className="text-balance">
                {selectedTechnicianId} has a confirmed assignment today — verify
                capacity before assigning another job.
              </AlertDescription>
            </Alert>
          ) : null}
          {jobsLeft === 0 && selectedTechnicianId !== null ? (
            <Alert variant="destructive">
              <AlertTitle>Daily cap reached</AlertTitle>
              <AlertDescription className="text-balance">
                {selectedTechnicianId} has no jobs left today — assign is disabled.
              </AlertDescription>
            </Alert>
          ) : null}
          <ActionBar
            assignDisabled={assignDisabled}
            assignLabel={assignLabel}
            onAssign={handleAssign}
            onHold={handleHold}
          />
        </div>
      </ScrollArea>

      <ConfirmDispatchDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        payload={confirmPayload}
        concurrencyError={concurrencyError}
        isSubmitting={confirmPending}
        onConfirm={handleConfirmDispatch}
      />

      <HoldWorkOrderDialog
        open={holdOpen}
        onOpenChange={setHoldOpen}
        payload={holdPayload}
        isSubmitting={holdPending}
        actionError={holdError}
        onHold={handleHoldWorkOrder}
      />
    </>
  );
}

type OperationsPanelProps = {
  className?: string;
};

/** Operations column with job card and tech candidates from the Foundry ontology. */
export function OperationsPanel({ className }: OperationsPanelProps): React.ReactElement {
  const { focusedWorkOrderId } = useWorkspaceSelection();
  const { job, isLoading: jobLoading, error: jobError } = useFocusedJob(focusedWorkOrderId);
  const {
    candidates,
    isLoading: techLoading,
    error: techError,
    refetch: refetchTechCandidates,
  } = useTechCandidates();

  const showJobSkeleton = focusedWorkOrderId !== null && (jobLoading || techLoading);

  return (
    <WorkspacePanel className={className}>
      <PanelHeader title="Operations" />
      {focusedWorkOrderId === null ? (
        <OperationsEmptyState />
      ) : showJobSkeleton ? (
        <OperationsPanelSkeleton />
      ) : jobError != null ? (
        <div className="flex flex-1 flex-col gap-3 p-panel-padding">
          <Alert variant="destructive">
            <AlertTitle>Failed to load work order</AlertTitle>
            <AlertDescription className="text-balance">{jobError.message}</AlertDescription>
          </Alert>
        </div>
      ) : job === null ? (
        <div className="flex flex-1 flex-col gap-3 p-panel-padding">
          <Alert variant="destructive">
            <AlertTitle>Work order not found</AlertTitle>
            <AlertDescription>
              {focusedWorkOrderId} is not in the ontology or you lack read access.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <>
          {techError != null ? (
            <div className="border-b border-border px-panel-padding py-1.5">
              <Alert variant="destructive">
                <AlertTitle>Technician list unavailable</AlertTitle>
                <AlertDescription className="text-balance">{techError.message}</AlertDescription>
              </Alert>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => refetchTechCandidates()}
              >
                Retry
              </Button>
            </div>
          ) : null}
          <OperationsJobContent
            key={focusedWorkOrderId}
            focusedJob={job}
            candidates={candidates}
          />
        </>
      )}
    </WorkspacePanel>
  );
}
