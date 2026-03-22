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


export const aboutRoutes = {
  get: "/websites/about",
} as const;

export const authRoutes = {
  login: "/websites/login",
  register: "/websites/register",
  profile: "/websites/profile",
  logout: "/websites/logout",
  updateProfile: "/websites/profile",
  updatePassword: "/websites/change-password",
} as const;

export const bannerRoutes = {
  home: "/websites/banners/home",
  about: "/websites/banners/about_us",
  blog: "/websites/banners/blog",
  contact: "/websites/banners/contact",
  shop: "/websites/banners/shop",
} as const;

export const contactRoutes = {
  get: "/websites/contact",
  post: "/websites/contact-messages",
} as const;

export const postRoutes = {
  get: "/websites/posts",
  read: "/websites/posts/{post}/read"
} as const;

export const showroomRoutes = {
  get: "/websites/showrooms",
} as const;
