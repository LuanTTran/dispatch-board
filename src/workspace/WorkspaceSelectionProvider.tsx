import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { MAX_COMPARE_TECHNICIANS } from "@/lenses/compare/types";
import type {
  SetFocusedWorkOrderOptions,
  WorkOrderFocusSource,
} from "@/workspace/focusSource";

type WorkspaceSelectionContextValue = {
  focusedWorkOrderId: string | null;
  focusSource: WorkOrderFocusSource | null;
  setFocusedWorkOrderId: (
    workOrderId: string | null,
    options?: SetFocusedWorkOrderOptions,
  ) => void;
  compareTechnicianIds: string[];
  toggleCompareTechnician: (technicianId: string) => void;
  /** Explicit assign target when two technicians are compared. Auto-derived when only one is selected. */
  assignTargetId: string | null;
  selectedTechnicianId: string | null;
  selectAssignTarget: (technicianId: string) => void;
};

const WorkspaceSelectionContext = createContext<WorkspaceSelectionContextValue | null>(
  null,
);

type WorkspaceSelectionProviderProps = {
  children: React.ReactNode;
  /** Initial focus syncs queue highlight with operations on first paint. */
  initialFocusedWorkOrderId?: string | null;
};

/** Shared focus and compare selection across queue, map, operations, and compare panels. */
export function WorkspaceSelectionProvider({
  children,
  initialFocusedWorkOrderId = null,
}: WorkspaceSelectionProviderProps): React.ReactElement {
  const [focusedWorkOrderId, setFocusedWorkOrderIdState] = useState<string | null>(
    initialFocusedWorkOrderId,
  );
  const [focusSource, setFocusSource] = useState<WorkOrderFocusSource | null>(
    initialFocusedWorkOrderId != null ? "map" : null,
  );
  const [compareTechnicianIds, setCompareTechnicianIds] = useState<string[]>([]);
  const [assignTargetId, setAssignTargetId] = useState<string | null>(null);

  const setFocusedWorkOrderId = useCallback(
    (workOrderId: string | null, options?: SetFocusedWorkOrderOptions) => {
      setFocusedWorkOrderIdState(workOrderId);
      setFocusSource(
        workOrderId != null ? (options?.source ?? "map") : null,
      );
      setCompareTechnicianIds([]);
      setAssignTargetId(null);
    },
    [],
  );

  const toggleCompareTechnician = useCallback((technicianId: string) => {
    setCompareTechnicianIds((current) => {
      if (current.includes(technicianId)) {
        const next = current.filter((id) => id !== technicianId);
        setAssignTargetId((target) => (target === technicianId ? null : target));
        return next;
      }
      if (current.length >= MAX_COMPARE_TECHNICIANS) {
        return current;
      }
      const next = [...current, technicianId];
      if (next.length === MAX_COMPARE_TECHNICIANS) {
        setAssignTargetId(null);
      }
      return next;
    });
  }, []);

  const selectAssignTarget = useCallback((technicianId: string) => {
    setAssignTargetId(technicianId);
  }, []);

  const selectedTechnicianId = useMemo(() => {
    if (compareTechnicianIds.length === 1) {
      return compareTechnicianIds[0] ?? null;
    }
    if (
      compareTechnicianIds.length === MAX_COMPARE_TECHNICIANS &&
      assignTargetId !== null &&
      compareTechnicianIds.includes(assignTargetId)
    ) {
      return assignTargetId;
    }
    return null;
  }, [assignTargetId, compareTechnicianIds]);

  const value = useMemo(
    () => ({
      focusedWorkOrderId,
      focusSource,
      setFocusedWorkOrderId,
      compareTechnicianIds,
      toggleCompareTechnician,
      assignTargetId,
      selectedTechnicianId,
      selectAssignTarget,
    }),
    [
      assignTargetId,
      compareTechnicianIds,
      focusSource,
      focusedWorkOrderId,
      selectAssignTarget,
      selectedTechnicianId,
      setFocusedWorkOrderId,
      toggleCompareTechnician,
    ],
  );

  return (
    <WorkspaceSelectionContext.Provider value={value}>
      {children}
    </WorkspaceSelectionContext.Provider>
  );
}

export function useWorkspaceSelection(): WorkspaceSelectionContextValue {
  const context = useContext(WorkspaceSelectionContext);
  if (context === null) {
    throw new Error("useWorkspaceSelection must be used within WorkspaceSelectionProvider");
  }
  return context;
}
