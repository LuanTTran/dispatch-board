import { useEffect } from "react";

/** One-time external sync on mount. Escape hatch for cases that cannot use standard React patterns. */
export function useMountEffect(effect: () => void | (() => void)): void {
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(effect, []);
}
