import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ConcurrencyErrorBannerProps = {
  message: string;
};

/** Shows who claimed the technician and when after a concurrency failure. */
export function ConcurrencyErrorBanner({
  message,
}: ConcurrencyErrorBannerProps): React.ReactElement {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Dispatch conflict</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
