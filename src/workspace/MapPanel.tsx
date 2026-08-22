import { useRef } from "react";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMapSites } from "@/hooks/useMapSites";
import { useMapTechnicians } from "@/hooks/useMapTechnicians";
import { cn } from "@/lib/utils";
import { ChicagolandMap } from "@/spatial/ChicagolandMap";
import { MapPanelSkeleton } from "@/workspace/skeletons/MapPanelSkeleton";
import { WorkspacePanel } from "@/workspace/WorkspacePanel";

type MapPanelProps = {
  className?: string;
};

/** Full-bleed Chicagoland map with site and tech pins from Foundry via map hooks. */
export function MapPanel({ className }: MapPanelProps): React.ReactElement {
  const {
    sites,
    isLoading: sitesLoading,
    error: sitesError,
    refetch: refetchSites,
  } = useMapSites();
  const {
    technicians,
    isLoading: techniciansLoading,
    error: techniciansError,
    refetch: refetchTechnicians,
  } = useMapTechnicians();

  const hasLoadedOnceRef = useRef(false);
  const isLoading = sitesLoading || techniciansLoading;

  if (!isLoading) {
    hasLoadedOnceRef.current = true;
  }

  const showInitialSkeleton = isLoading && !hasLoadedOnceRef.current;
  const showMap = hasLoadedOnceRef.current;
  const hasPartialError = sitesError != null || techniciansError != null;

  const handleRetry = (): void => {
    if (sitesError != null) {
      refetchSites();
    }
    if (techniciansError != null) {
      refetchTechnicians();
    }
  };

  return (
    <WorkspacePanel className={cn("relative", className)}>
      {hasPartialError ? (
        <div className="flex items-center gap-2 border-b border-status-warning/30 bg-status-warning/10 px-3 py-1 text-xs text-status-warning-foreground">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          <p className="min-w-0 flex-1 text-balance">
            {sitesError != null && techniciansError != null
              ? "Map pins unavailable — Foundry connection issue."
              : sitesError != null
                ? "Site pins unavailable — technician pins still shown."
                : "Technician pins unavailable — site pins still shown."}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 shrink-0 px-2 text-xs"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </div>
      ) : null}

      {showInitialSkeleton ? <MapPanelSkeleton /> : null}
      {showMap ? (
        <ChicagolandMap
          className="min-h-0 flex-1"
          sites={sitesError != null ? [] : sites}
          technicians={techniciansError != null ? [] : technicians}
        />
      ) : null}
    </WorkspacePanel>
  );
}
