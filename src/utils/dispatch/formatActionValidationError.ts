import { ActionValidationError } from "@osdk/client";

/** User-facing error message for governed action failures such as concurrency or parts guard. */
export function formatActionValidationError(error: unknown): string {
  if (error instanceof ActionValidationError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Action failed — try again or refresh state";
}
