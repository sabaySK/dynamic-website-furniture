import { authRoutes } from "@/services/api-route";
import { removeAuthTokens } from "@/services/api-config";

export async function logout() {
  // DEMO MODE: Simulate successful logout
  console.log("DEMO MODE: Simulating logout");
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Clear tokens
      removeAuthTokens();
      localStorage.removeItem("current_user");
      
      console.log("DEMO MODE: Logout success");
      resolve({
        success: true,
        message: "Logged out successfully (Demo Mode)"
      });
    }, 500);
  });

  /* Original implementation commented out for Demo
  try {
    const res = await fetch(authRoutes.logout, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include",
    });

    // Even if the server request fails, we should clear client-side tokens
    removeAuthTokens();
    localStorage.removeItem("current_user");

    if (!res.ok) {
      console.warn("Logout request returned non-ok status:", res.status);
    }

    return {
      success: true,
      message: "Successfully logged out",
    };
  } catch (err) {
    console.error("Logout request failed", err);
    // Still clear tokens on error
    removeAuthTokens();
    localStorage.removeItem("current_user");
    throw err;
  }
  */
}
