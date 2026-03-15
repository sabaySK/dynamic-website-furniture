import { authRoutes } from "@/services/api-route";

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export async function register(payload: RegisterPayload) {
  // DEMO MODE: Simulate successful registration
  console.log("DEMO MODE: Simulating registration for", payload.phone);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In demo mode, we'll just succeed
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        name: payload.name,
        email: payload.email,
        phone: payload.phone
      };
      
      console.log("DEMO MODE: Register success", mockUser);
      resolve({
        success: true,
        data: mockUser,
        message: "Registration successful (Demo Mode)"
      });
    }, 1000);
  });

  /* Original implementation commented out for Demo
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
  */
}
