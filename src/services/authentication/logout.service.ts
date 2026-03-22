import { authRoutes } from "@/services/api-route";
import { removeAuthTokens } from "@/services/api-config";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";

function clearClientSession(): void {
  removeAuthTokens();
  localStorage.removeItem("current_user");
}

/**
 * Calls POST /websites/logout with auth headers, then always clears local session.
 * Uses suppress401Redirect so a stale token does not trigger a global redirect loop.
 */
export async function logout(config?: RequestConfig) {
  try {
    await apiClient.post<unknown>(authRoutes.logout, {}, {
      suppress401Redirect: true,
      ...(config ?? {}),
    });
  } catch (err) {
    console.warn("Logout request failed; clearing client session anyway", err);
  } finally {
    clearClientSession();
  }

  return {
    success: true,
    message: "Successfully logged out",
  };
}
