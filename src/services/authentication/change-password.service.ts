import { authRoutes } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * POST /websites/change-password
 */
export async function changePassword(payload: ChangePasswordPayload, config?: RequestConfig) {
  return apiClient.post<unknown>(authRoutes.updatePassword, payload, {
    suppress401Redirect: true,
    ...(config ?? {}),
  });
}
