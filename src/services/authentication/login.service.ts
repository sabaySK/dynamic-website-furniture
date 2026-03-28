import { authRoutes } from "@/services/api-route";
import { requestNotificationPermission } from "@/firebase-messaging";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";

interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
  platform?: string;
}

export async function login(payload: LoginPayload, config?: RequestConfig) {
  const { email, phone, password, platform = "web" } = payload;

  // Try to get existing FCM token from localStorage, otherwise request it
  let fcmToken = localStorage.getItem("fcm_token");
  if (!fcmToken) {
    try {
      fcmToken = await requestNotificationPermission();
      if (fcmToken) localStorage.setItem("fcm_token", fcmToken);
    } catch (err) {
      console.warn("Could not obtain FCM token before login", err);
    }
  }

  const body = {
    phone,
    email,
    password,
    fcm_token: fcmToken ?? "",
    platform,
  };

  // Use shared apiClient so errors and parsing are consistent
  const res = await apiClient.post<any>(authRoutes.login, body, { skipAuth: true, ...(config ?? {}) });
  return res;
}
