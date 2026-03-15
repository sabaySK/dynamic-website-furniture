import { authRoutes } from "@/services/api-route";
import { requestNotificationPermission } from "@/firebase-messaging";

interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
  platform?: string;
}

export async function login(payload: LoginPayload) {
  const { email, phone, password, platform = "web" } = payload;
  const identifier = email || phone || "unknown";

  // DEMO MODE: Simulate successful login
  console.log("DEMO MODE: Simulating login for", identifier);
  
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // Try to get existing FCM token from localStorage, otherwise request it
      let fcmToken = localStorage.getItem("fcm_token");
      if (!fcmToken) {
        try {
          fcmToken = await requestNotificationPermission();
          if (fcmToken) {
            localStorage.setItem("fcm_token", fcmToken);
          }
        } catch (err) {
          console.warn("Could not obtain FCM token before login", err);
        }
      }

      // In demo mode, we'll allow any login but check for the user's provided credentials in logs
      const mockUser = {
        id: 1,
        phone: phone || "0968255000",
        name: "Demo User",
        email: email || "demo@example.com",
        access_token: "demo_token_12345"
      };
      
      console.log("DEMO MODE: Login success", mockUser);
      resolve({
        success: true,
        data: mockUser,
        user: mockUser,
        message: "Login successful (Demo Mode)"
      });
    }, 1000);
  });

  /* Original implementation commented out for Demo
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
  */
}
