import {
  TechnicianPoolContext,
  useTechnicianPool,
} from "@/hooks/useTechnicianPool";

type TechnicianPoolProviderProps = {
  children: React.ReactNode;
};

/** One Chicago-hub tech + assignment fetch for map pins, candidates, and compare. */
export function TechnicianPoolProvider({
  children,
}: TechnicianPoolProviderProps): React.ReactElement {
  const value = useTechnicianPool();

  return (
    <TechnicianPoolContext.Provider value={value}>
      {children}
    </TechnicianPoolContext.Provider>
  );
}
