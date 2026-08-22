import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";
import { SpatialPopupBadge } from "@/spatial/SpatialPopupBadge";
import type { MapTechnicianData } from "@/spatial/types";

type TechnicianPinPopupProps = {
  technician: MapTechnicianData;
};

/** Tech pin popup for context only. Does not change the focused work order. */
export function TechnicianPinPopup({
  technician,
}: TechnicianPinPopupProps): React.ReactElement {
  return (
    <div className="min-w-[180px] space-y-1.5 text-sm">
      <SpatialPopupBadge label="Technician" />
      <p className="font-medium text-foreground">{technician.name}</p>
      <p className="text-muted-foreground">
        {technician.skillsLabel} · {technician.jobsLeftLabel}
      </p>
      <p
        className={cn(
          "flex items-center gap-1",
          technician.locationStale
            ? "text-status-warning-foreground"
            : "text-muted-foreground",
        )}
      >
        Location: {technician.locationLabel}
        {technician.locationStale ? (
          <AlertTriangle className="size-3.5 shrink-0" aria-label="Stale location" />
        ) : null}
      </p>
    </div>
  );
}
