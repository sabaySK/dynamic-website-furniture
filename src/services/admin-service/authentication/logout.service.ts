import { adminAuthRoutes } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import { removeAuthTokens } from "@/services/api-config";
import type { RequestConfig } from "@/services/api-type";

function clearClientSession(): void {
  removeAuthTokens();
  localStorage.removeItem("current_user");
}

/**
 * Admin logout
 * Calls POST /admin/logout (if reachable) then always clears client auth.
 */
export async function logout(config?: RequestConfig) {
  try {
    await apiClient.post<any>(adminAuthRoutes.logout, {}, { suppress401Redirect: true, ...(config ?? {}) });
  } catch (err) {
    // Even if server logout fails, clear client session.
    console.warn("Admin logout request failed; clearing client session anyway", err);
  } finally {
    clearClientSession();
  }

  return { success: true, message: "Logged out" };
}

