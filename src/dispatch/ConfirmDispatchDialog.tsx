import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { canConfirmDispatch } from "@/dispatch/confirmDispatchGuards";
import { ConcurrencyErrorBanner } from "@/dispatch/ConcurrencyErrorBanner";
import type { ConfirmDispatchPayload } from "@/dispatch/types";
import { cn } from "@/lib/utils";

type ConfirmDispatchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: ConfirmDispatchPayload | null;
  concurrencyError?: string | null;
  isSubmitting?: boolean;
  onConfirm: (values: { overrideReason: string; acknowledged: boolean }) => void | Promise<void>;
};

/** Confirm dialog for assign. Shows parts path, confidence, stale acknowledgment, and red override. */
export function ConfirmDispatchDialog({
  open,
  onOpenChange,
  payload,
  concurrencyError = null,
  isSubmitting = false,
  onConfirm,
}: ConfirmDispatchDialogProps): React.ReactElement {
  const [acknowledged, setAcknowledged] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      setAcknowledged(false);
      setOverrideReason("");
    }
    onOpenChange(nextOpen);
  };

  const confirmEnabled =
    payload !== null &&
    canConfirmDispatch({ payload, acknowledged, overrideReason }) &&
    !isSubmitting;

  const handleConfirm = (): void => {
    if (payload === null || !confirmEnabled) {
      return;
    }
    onConfirm({ overrideReason: overrideReason.trim(), acknowledged });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm dispatch</DialogTitle>
          {payload !== null ? (
            <DialogDescription>
              {payload.workOrderId} → {payload.technicianId}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {payload !== null ? (
          <div className="space-y-4">
            {concurrencyError !== null ? (
              <ConcurrencyErrorBanner message={concurrencyError} />
            ) : null}

            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Part path</dt>
                <dd className="font-medium text-foreground">{payload.partPathSummary}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Prediction confidence</dt>
                <dd
                  className={cn(
                    "font-medium tabular-nums",
                    payload.predictionConfidence < 0.5
                      ? "text-status-warning-foreground"
                      : "text-foreground",
                  )}
                >
                  {payload.predictionConfidence.toFixed(2)}
                </dd>
              </div>
              {payload.isStale ? (
                <p className="text-sm text-status-warning-foreground">
                  Inventory or location signals may be stale — acknowledgment required.
                </p>
              ) : null}
            </dl>

            {payload.requiresAck ? (
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3">
                <Checkbox
                  checked={acknowledged}
                  onCheckedChange={(checked) => setAcknowledged(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-sm leading-snug text-foreground">
                  I acknowledge inventory/location signals may be stale
                  {payload.predictionConfidence < 0.5 ? " or prediction confidence is low" : ""}
                </span>
              </label>
            ) : null}

            {payload.requiresOverride ? (
              <div className="space-y-1.5">
                <label
                  htmlFor="override-reason"
                  className="text-sm font-medium text-foreground"
                >
                  Override reason (required if RED)
                </label>
                <Textarea
                  id="override-reason"
                  value={overrideReason}
                  onChange={(event) => setOverrideReason(event.target.value)}
                  placeholder="Explain why dispatch proceeds without viable stock"
                  rows={3}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!confirmEnabled} onClick={() => void handleConfirm()}>
            Confirm dispatch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
