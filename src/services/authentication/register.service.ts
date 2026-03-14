import { authRoutes } from "@/services/api-route";

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export async function register(payload: RegisterPayload) {
  try {
    console.log("POST", authRoutes.register, payload);
    const res = await fetch(authRoutes.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Register error response:", res.status, text);
      throw new Error(text || `Register failed with status ${res.status}`);
    }

    const data = await res.json().catch(() => null);
    console.log("Register response:", data);
    return data;
  } catch (err) {
    console.error("Register request failed", err);
    throw err;
  }
}

