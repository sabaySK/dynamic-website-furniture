import { adminAuthRoutes } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

/**
 * Admin login
 * POST /admin/login
 */
export async function adminLogin(payload: AdminLoginPayload, config?: RequestConfig) {
  // Admin auth is public from the client perspective
  return apiClient.post<any>(adminAuthRoutes.login, payload, {
    skipAuth: true,
    ...(config ?? {}),
  });
}

