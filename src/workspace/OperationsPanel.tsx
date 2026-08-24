import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ActionBar } from "@/dispatch/ActionBar";
import { ConfirmDispatchDialog } from "@/dispatch/ConfirmDispatchDialog";
import { DispatchSuccessBanner } from "@/dispatch/DispatchSuccessBanner";
import { HoldWorkOrderDialog } from "@/dispatch/HoldWorkOrderDialog";
import { TechCandidateList } from "@/dispatch/TechCandidateList";
import type { HoldWorkOrderPayload, TechCandidateData } from "@/dispatch/types";
import { useConfirmDispatch } from "@/hooks/useConfirmDispatch";
import { useFocusedJob } from "@/hooks/useFocusedJob";
import { useHoldWorkOrder } from "@/hooks/useHoldWorkOrder";
import { useTechCandidates } from "@/hooks/useTechCandidates";
import { JobCardHeader } from "@/lenses/operations/JobCardHeader";
import { JobDetailsExpander } from "@/lenses/operations/JobDetailsExpander";
import { OperationsEmptyState } from "@/lenses/operations/OperationsEmptyState";
import type { JobCardData } from "@/lenses/operations/types";
import { buildConfirmDispatchActionParams } from "@/utils/dispatch/buildConfirmDispatchActionParams";
import { buildConfirmPayload } from "@/utils/dispatch/buildConfirmPayload";
import { formatActionValidationError } from "@/utils/dispatch/formatActionValidationError";
import { useCompareData } from "@/workspace/CompareDataProvider";
import { PanelHeader } from "@/workspace/PanelHeader";
import { WorkspacePanel } from "@/workspace/WorkspacePanel";
import { useWorkspaceSelection } from "@/workspace/WorkspaceSelectionProvider";
import { OperationsPanelSkeleton } from "@/workspace/skeletons/OperationsPanelSkeleton";

type OperationsJobContentProps = {
  focusedJob: JobCardData;
  candidates: TechCandidateData[];
};

/** Job card and tech list. Compare columns come from CompareDataProvider. */
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
    confirmedDispatch,
    markDispatchConfirmed,
  } = useWorkspaceSelection();

  const {
    compareTechs,
    topPrediction,
    confirmedTodayTechnicianIds,
    isLoading: compareLoading,
  } = useCompareData();

  const compareTech =
    selectedTechnicianId != null
      ? (compareTechs.find((tech) => tech.technicianId === selectedTechnicianId) ?? null)
      : null;

  const jobsLeft = compareTech?.jobsLeft ?? null;

  const hasConfirmedAssignmentToday =
    selectedTechnicianId != null && confirmedTodayTechnicianIds.has(selectedTechnicianId);

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

  const isDispatched = confirmedDispatch?.workOrderId === focusedJob.workOrderId;

  const assignDisabled =
    isDispatched || selectedTechnicianId === null || compareLoading || jobsLeft === 0;

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
      markDispatchConfirmed({
        workOrderId: confirmPayload.workOrderId,
        technicianId: confirmPayload.technicianId,
      });
      toast.success(`Assigned ${confirmPayload.technicianId} to ${confirmPayload.workOrderId}`);
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

  const assignLabel = isDispatched
    ? "Assigned"
    : selectedTechnicianId !== null
      ? `Assign ${selectedTechnicianId}`
      : "Assign";

  return (
    <>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-panel-padding">
          <JobCardHeader job={focusedJob} />
          {isDispatched && confirmedDispatch != null ? (
            <DispatchSuccessBanner
              workOrderId={confirmedDispatch.workOrderId}
              technicianId={confirmedDispatch.technicianId}
            />
          ) : null}
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
          {hasConfirmedAssignmentToday && selectedTechnicianId !== null && !isDispatched ? (
            <Alert variant="default">
              <AlertTitle>Already dispatched today</AlertTitle>
              <AlertDescription className="text-balance">
                {selectedTechnicianId} has a confirmed assignment today — verify capacity before
                assigning another job.
              </AlertDescription>
            </Alert>
          ) : null}
          {jobsLeft === 0 && selectedTechnicianId !== null && !isDispatched ? (
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
            holdDisabled={isDispatched}
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
  const { focusedWorkOrderId, confirmedDispatch } = useWorkspaceSelection();
  const { job, isLoading: jobLoading, error: jobError } = useFocusedJob(focusedWorkOrderId);
  const {
    candidates,
    isLoading: techLoading,
    error: techError,
    refetch: refetchTechCandidates,
  } = useTechCandidates();

  const showJobSkeleton = focusedWorkOrderId !== null && job == null && (jobLoading || techLoading);

  return (
    <WorkspacePanel className={className}>
      <PanelHeader
        title="Operations"
        action={
          confirmedDispatch?.workOrderId === focusedWorkOrderId ? (
            <Badge
              variant="secondary"
              className="bg-status-success-muted text-status-success-foreground"
            >
              Dispatched
            </Badge>
          ) : undefined
        }
      />
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
          <OperationsJobContent key={focusedWorkOrderId} focusedJob={job} candidates={candidates} />
        </>
      )}
    </WorkspacePanel>
  );
}
