import { useRef } from "react";

/** Stays true after the first settled load so refetch does not remount skeletons. */
export function useHasLoadedOnce(isLoading: boolean): boolean {
  const hasLoadedOnceRef = useRef(false);

  if (!isLoading) {
    hasLoadedOnceRef.current = true;
  }

  return hasLoadedOnceRef.current;
}
