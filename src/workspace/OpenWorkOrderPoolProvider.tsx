import {
  OpenWorkOrderPoolContext,
  useOpenWorkOrderPool,
} from "@/hooks/useOpenWorkOrderPool";

type OpenWorkOrderPoolProviderProps = {
  children: React.ReactNode;
};

/** One OPEN-queue work-order fetch for the queue list and map site pins. */
export function OpenWorkOrderPoolProvider({
  children,
}: OpenWorkOrderPoolProviderProps): React.ReactElement {
  const value = useOpenWorkOrderPool();

  return (
    <OpenWorkOrderPoolContext.Provider value={value}>
      {children}
    </OpenWorkOrderPoolContext.Provider>
  );
}
