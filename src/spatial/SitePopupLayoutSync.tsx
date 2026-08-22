import type { Popup as LeafletPopup } from "leaflet";
import type { RefObject } from "react";

import { useMountEffect } from "@/hooks/useMountEffect";

type SitePopupLayoutSyncProps = {
  popupRef: RefObject<LeafletPopup | null>;
};

/** Re-measures popup after React content paints so autopan uses the final height. */
export function SitePopupLayoutSync({
  popupRef,
}: SitePopupLayoutSyncProps): null {
  useMountEffect(() => {
    const syncLayout = (): void => {
      popupRef.current?.update();
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(syncLayout);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  });

  return null;
}
