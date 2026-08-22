import type {
  _osdkPartPrediction,
  _osdkWorkOrder,
  OsdkCustomerSite,
  OsdkDispatchDecision,
  OsdkEquipment,
  OsdkHubInventory,
} from "@dispatch-command-board/sdk";

import type { JobCardData } from "@/lenses/operations/types";
import { formatTimestampLabel } from "@/utils/format/formatTimestampLabel";
import { formatSlaLabel } from "@/utils/queue/slaPresentation";
import { classifyInventoryStalenessLabel } from "@/utils/staleness/classifyInventoryStaleness";
import { formatAgeLabel } from "@/utils/staleness/formatAgeLabel";

type WorkOrderInstance = _osdkWorkOrder.OsdkInstance;
type CustomerSiteInstance = OsdkCustomerSite.OsdkInstance;
type EquipmentInstance = OsdkEquipment.OsdkInstance;
type PartPredictionInstance = _osdkPartPrediction.OsdkInstance;
type HubInventoryInstance = OsdkHubInventory.OsdkInstance;
type DispatchDecisionInstance = OsdkDispatchDecision.OsdkInstance;

export type MapFocusedJobInput = {
  workOrder: WorkOrderInstance;
  customerSite: CustomerSiteInstance | undefined;
  equipment: EquipmentInstance | undefined;
  predictions: readonly PartPredictionInstance[];
  hubInventory: HubInventoryInstance | undefined;
  priorDecisions: readonly DispatchDecisionInstance[];
  nowMs?: number;
};

function formatPriorityLabel(priority: string | undefined): string {
  if (priority == null || priority.length === 0) {
    return "URGENT";
  }

  return priority.replace(/_/g, " ").toUpperCase();
}

function formatSiteOneLiner(site: CustomerSiteInstance | undefined): string {
  if (site == null) {
    return "Site pending";
  }

  const name = site.name ?? site.siteId;
  const city = site.city ?? "Central";
  return `${name} · ${city}`;
}

function formatEquipmentOneLiner(
  equipment: EquipmentInstance | undefined,
  topSkuId: string | undefined,
  symptom: string | undefined,
): string {
  if (equipment?.model != null) {
    const skuSuffix = topSkuId != null ? ` · ${topSkuId}` : "";
    return `${equipment.model}${skuSuffix}`;
  }

  if (symptom != null && symptom.length > 0) {
    const skuSuffix = topSkuId != null ? ` · ${topSkuId}` : "";
    return `${symptom}${skuSuffix}`;
  }

  return topSkuId != null ? `Equipment · ${topSkuId}` : "Equipment pending";
}

function formatDecisionSummary(decision: DispatchDecisionInstance): string {
  if (decision.reason != null && decision.reason.length > 0) {
    return decision.reason;
  }

  return decision.decisionType?.replace(/_/g, " ") ?? "Decision";
}

function formatActorLabel(actor: string | undefined): string {
  if (actor == null) {
    return "Unknown";
  }

  return actor.replace(/^coordinator\./, "");
}

/** Maps OSDK WorkOrder and linked objects to the operations job card view model. */
export function mapFocusedJob({
  workOrder,
  customerSite,
  equipment,
  predictions,
  hubInventory,
  priorDecisions,
  nowMs = Date.now(),
}: MapFocusedJobInput): JobCardData {
  const sortedPredictions = [...predictions].sort(
    (left, right) => (left.rank ?? 0) - (right.rank ?? 0),
  );
  const topPrediction = sortedPredictions[0];
  const topSkuId = topPrediction?.skuId;

  return {
    workOrderId: workOrder.workOrderId,
    slaLabel: formatSlaLabel(workOrder.slaDeadline, nowMs),
    priorityLabel: formatPriorityLabel(workOrder.priority),
    siteOneLiner: formatSiteOneLiner(customerSite),
    equipmentOneLiner: formatEquipmentOneLiner(
      equipment,
      topSkuId,
      workOrder.symptom,
    ),
    symptom: workOrder.symptom ?? "Symptom unavailable",
    details: {
      site: {
        name: customerSite?.name ?? customerSite?.siteId ?? "—",
        city: customerSite?.city ?? "—",
        zip: customerSite?.zip != null ? String(customerSite.zip) : "—",
      },
      equipment: {
        model: equipment?.model ?? "—",
        serialNumber: equipment?.serialNumber ?? "—",
        category: equipment?.category ?? workOrder.equipmentCategory ?? "—",
      },
      predictions: sortedPredictions.map((prediction) => ({
        rank: prediction.rank ?? 0,
        skuId: prediction.skuId ?? "—",
        confidence: prediction.confidence ?? 0,
      })),
      hubStock: {
        skuId: topSkuId ?? hubInventory?.skuId ?? "—",
        quantity: Number(hubInventory?.quantity ?? 0),
        asOfLabel: formatAgeLabel(hubInventory?.asOfTimestamp),
        stalenessLabel: classifyInventoryStalenessLabel(
          hubInventory?.asOfTimestamp,
          nowMs,
        ),
      },
      priorDecisions: priorDecisions.map((decision) => ({
        timestampLabel: formatTimestampLabel(decision.timestamp),
        actor: formatActorLabel(decision.actor),
        summary: formatDecisionSummary(decision),
      })),
    },
  };
}
