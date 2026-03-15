import { authRoutes } from "@/services/api-route";
import { requestNotificationPermission } from "@/firebase-messaging";

interface LoginPayload {
  phone: string;
  password: string;
  platform?: string;
}

export async function login(payload: LoginPayload) {
  const { phone, password, platform = "web" } = payload;

  // Try to get existing FCM token from localStorage, otherwise request it
  let fcmToken = localStorage.getItem("fcm_token");
  if (!fcmToken) {
    try {
      // requestNotificationPermission will register SW and return token (or null)
      fcmToken = await requestNotificationPermission();
      if (fcmToken) {
        localStorage.setItem("fcm_token", fcmToken);
      }
    } catch (err) {
      console.warn("Could not obtain FCM token before login", err);
    }
  }

  const body = {
    phone,
    password,
    fcm_token: fcmToken ?? "",
    platform,
  };
  try {
    console.log("POST", authRoutes.login, body);
    const res = await fetch(authRoutes.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Login error response:", res.status, text);
      throw new Error(text || `Login failed with status ${res.status}`);
    }

    const data = await res.json().catch(() => null);
    console.log("Login response:", data);
    return data;
  } catch (err) {
    console.error("Login request failed", err);
    throw err;
  }
}

