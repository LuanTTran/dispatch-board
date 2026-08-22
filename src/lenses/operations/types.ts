/** View model for the focused work order header. Mapped from WorkOrder and links in useFocusedJob. */
export type JobCardData = {
  workOrderId: string;
  slaLabel: string;
  priorityLabel: string;
  siteOneLiner: string;
  equipmentOneLiner: string;
  /** Work order symptom shown in the hold dialog and investigative context. */
  symptom: string;
  details: JobDetailsData;
};

export type JobDetailsData = {
  site: { name: string; city: string; zip: string };
  equipment: { model: string; serialNumber: string; category: string };
  predictions: { rank: number; skuId: string; confidence: number }[];
  hubStock: { skuId: string; quantity: number; asOfLabel: string; stalenessLabel: string };
  priorDecisions: { timestampLabel: string; actor: string; summary: string }[];
};
