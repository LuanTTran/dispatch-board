import { createContext, useContext } from "react";

import {
  useTechCompare,
  type UseTechCompareResult,
} from "@/hooks/useTechCompare";
import { useTechnicianPoolData } from "@/hooks/useTechnicianPool";
import { useWorkspaceSelection } from "@/workspace/WorkspaceSelectionProvider";

const CompareDataContext = createContext<UseTechCompareResult | null>(null);

type CompareDataProviderProps = {
  children: React.ReactNode;
};

/** One compare fetch graph for operations confirm and the compare strip. */
export function CompareDataProvider({
  children,
}: CompareDataProviderProps): React.ReactElement {
  const { focusedWorkOrderId, compareTechnicianIds } = useWorkspaceSelection();
  const pool = useTechnicianPoolData();
  const value = useTechCompare(focusedWorkOrderId, compareTechnicianIds, pool);

  return (
    <CompareDataContext.Provider value={value}>
      {children}
    </CompareDataContext.Provider>
  );
}

export function useCompareData(): UseTechCompareResult {
  const context = useContext(CompareDataContext);
  if (context === null) {
    throw new Error("useCompareData must be used within CompareDataProvider");
  }
  return context;
}
