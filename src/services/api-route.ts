/**
 * API Routes
 * 
 * Centralized API endpoint definitions for all resources.
 * Use these constants instead of hardcoding endpoint strings.
 * 
 * Usage:
 * ```ts
 * import { apiRoutes } from "@/services/api-route";
 * import { apiClient } from "@/services";
 * 
 * const bookings = await apiClient.get(apiRoutes.bookings.getAll);
 * ```
 */

/**
 * Authentication endpoints
 */
export const authRoutes = {
  login: "/api/websites/login",
  register: "/api/websites/register",
  profile: "/api/websites/profile",
} as const;

export const showroomRoutes = {
  get: "/websites/showrooms",
} as const;

export const contactRoutes = {
  get: "/websites/contact",
  post: "/websites/contact-messages",
} as const;