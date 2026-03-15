import { authRoutes } from "@/services/api-route";

export interface ProfileUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  email_verified_at?: string | null;
  role?: string;
  status?: string;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfilePayload {
  message?: string;
  user?: ProfileUser | null;
}

export async function fetchProfile(): Promise<ProfilePayload> {
  // DEMO MODE: Simulate profile fetch success
  console.log("DEMO MODE: Simulating profile fetch");
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get the current user from localStorage if it was set during login
      const storedUser = localStorage.getItem("current_user");
      let user: ProfileUser | null = null;
      
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          user = {
            id: parsed.id ?? 1,
            name: parsed.name ?? "Demo User",
            email: parsed.email ?? "demo@example.com",
            phone: parsed.phone ?? "0968255000",
            address: "123 Scandinavian St, NØRD City",
            role: "user",
            status: "active",
            created_at: new Date().toISOString()
          };
        } catch (e) {
          console.error("Demo Mode: Error parsing stored user", e);
        }
      } else {
        // Fallback for demo
        user = {
          id: 1,
          name: "Demo User",
          email: "demo@example.com",
          phone: "0968255000",
          address: "123 Scandinavian St, NØRD City",
          role: "user",
          status: "active",
          created_at: new Date().toISOString()
        };
      }

      console.log("DEMO MODE: Profile success", user);
      resolve({
        message: "Profile fetched successfully (Demo Mode)",
        user
      });
    }, 500);
  });

  /* Original implementation commented out for Demo
  try {
    const res = await fetch(authRoutes.profile, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Profile error response:", res.status, text);
      throw new Error(`Failed to fetch profile (${res.status})`);
    }

    const data = await res.json().catch(() => ({}));

    const rawUser = data?.user ?? null;

    const user: ProfileUser | null = rawUser
      ? {
          id: Number(rawUser.id),
          name: rawUser.name ?? "",
          email: rawUser.email ?? "",
          phone: rawUser.phone ?? null,
          address: rawUser.address ?? null,
          email_verified_at: rawUser.email_verified_at ?? null,
          role: rawUser.role ?? undefined,
          status: rawUser.status ?? undefined,
          image: rawUser.image ?? null,
          created_at: rawUser.created_at ?? undefined,
          updated_at: rawUser.updated_at ?? undefined,
        }
      : null;

    return {
      message: data?.message ?? "",
      user,
    };
  } catch (err) {
    console.error("Fetch profile failed", err);
    throw err;
  }
  */
}
