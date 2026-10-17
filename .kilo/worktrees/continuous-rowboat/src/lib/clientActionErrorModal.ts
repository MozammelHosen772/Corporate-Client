/* eslint-disable @typescript-eslint/no-explicit-any */

import { dispatchSessionExpired } from "@/components/SessionExpiredHandler";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const clientActionErrorModal = (error: unknown): boolean => {
  // ✅ redirect error — re-throw
  if (isRedirectError(error)) throw error;

  if (
    (error instanceof Error && error.name === "SessionExpiredError") ||
    (error as any)?.isSessionExpired === true
  ) {
    dispatchSessionExpired((error as any).message);
    return true;
  }
  return false;
};
