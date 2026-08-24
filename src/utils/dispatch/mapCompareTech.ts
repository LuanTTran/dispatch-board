import type { _osdkTechnician } from "@dispatch-command-board/sdk";

import type { CompareTechData } from "@/lenses/compare/types";
import {
  classifyPartsPath,
  type InventorySnapshot,
} from "@/utils/dispatch/classifyPartsPath";
import { formatSkillsLabel } from "@/utils/dispatch/formatSkillsLabel";
import { formatJobsLeftLabel, computeJobsLeft } from "@/utils/dispatch/jobsLeftPresentation";
import { formatAgeLabel } from "@/utils/staleness/formatAgeLabel";
import { isLocationStale } from "@/utils/staleness/isLocationStale";

type TechnicianInstance = _osdkTechnician.OsdkInstance;

export type MapCompareTechInput = {
  technician: TechnicianInstance;
  skuId: string;
  truckInventory: InventorySnapshot | undefined;
  hubInventory: InventorySnapshot | undefined;
  assignmentsToday: number;
  nowMs?: number;
};

/** Maps OSDK Technician and inventory rows to one compare column view model. */
export function mapCompareTech({
  technician,
  skuId,
  truckInventory,
  hubInventory,
  assignmentsToday,
  nowMs = Date.now(),
}: MapCompareTechInput): CompareTechData {
  const partsPath = classifyPartsPath({
    skuId,
    truck: truckInventory,
    hub: hubInventory,
    nowMs,
  });

  return {
    technicianId: technician.technicianId,
    label: technician.name ?? technician.technicianId,
    skillsLabel: formatSkillsLabel(technician.skillTags),
    jobsLeftLabel: formatJobsLeftLabel(
      technician.maxDailyJobs,
      assignmentsToday,
    ),
    jobsLeft: computeJobsLeft(technician.maxDailyJobs, assignmentsToday),
    partsPath: {
      status: partsPath.status,
      statusLabel: partsPath.statusLabel,
      sourceLabel: partsPath.sourceLabel,
      skuId: partsPath.skuId,
      quantity: partsPath.quantity,
      asOfLabel: partsPath.asOfLabel,
      supplementLabel: partsPath.supplementLabel,
    },
    locationLabel: formatAgeLabel(technician.locationAsOfTimestamp),
    locationStale: isLocationStale(technician.locationAsOfTimestamp, nowMs),
    truckInventoryStale: partsPath.truckInventoryStale,
  };
}
