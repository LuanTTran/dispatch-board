import { useMemo } from "react";

import type { MapTechnicianData } from "@/spatial/types";
import { useTechnicianPoolData } from "@/hooks/useTechnicianPool";
import { mapMapTechnicians } from "@/utils/spatial/mapMapTechnician";

type UseMapTechniciansResult = {
  technicians: MapTechnicianData[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: () => void;
};

/** Map pins from the shared Chicago-hub technician pool plus jobs-left. */
export function useMapTechnicians(): UseMapTechniciansResult {
  const { technicians, countsByTechnicianId, isLoading, error, refetch } =
    useTechnicianPoolData();

  const mapTechnicians = useMemo(
    () => mapMapTechnicians(technicians, countsByTechnicianId),
    [technicians, countsByTechnicianId],
  );

  return {
    technicians: mapTechnicians,
    isLoading,
    error,
    refetch,
  };
}
