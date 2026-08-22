import type { PartsPathStatus } from "@/lenses/compare/types";

/** View model for one technician candidate row. Mapped from Technician in useTechCandidates. */
export type TechCandidateData = {
  technicianId: string;
  label: string;
  jobsLeftLabel: string;
};

/** Payload for the assign confirm dialog. Built from focused work order, selected tech, and compare data. */
export type ConfirmDispatchPayload = {
  workOrderId: string;
  technicianId: string;
  selectedPartSkuId: string;
  partPathSummary: string;
  partsPathStatus: PartsPathStatus;
  predictionConfidence: number;
  /** Truck inventory or tech location exceeds staleness threshold. */
  isStale: boolean;
  requiresAck: boolean;
  requiresOverride: boolean;
};

/** Payload for the hold dialog. Includes symptom from the focused work order. */
export type HoldWorkOrderPayload = {
  workOrderId: string;
  symptomOneLiner: string;
};
