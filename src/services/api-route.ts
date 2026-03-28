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




/** Admin Routes */

export const adminAboutRoutes = {
  get: "/admin/about",
  upsert: "/admin/about",
} as const;

export const adminAuthRoutes = {
  login: "/admin/login",
  logout: "/admin/logout",
  profile: "/admin/profile",
} as const;

export const adminCustomerRoute = {
  get: "/admin/customers",
  updateStatus: "/admin/customers/{customer}/status",
} as const;

export const adminBannerRoute = {
  get: "/admin/banners",
  create: "/admin/banners",
  update: "/admin/banners/{banner}",
  delete: "/admin/banners/{banner}",
} as const;

export const adminCertificationsRoute = {
  get: "/admin/about/certifications",
  create: "/admin/about/certifications",
  update: "/admin/about/certifications/{certification}",
  delete: "/admin/about/certifications/{certification}",
} as const;

export const adminOurValuesRoute = {
  get: "/admin/about/our-values",
  create: "/admin/about/our-values",
  update: "/admin/about/our-values/{ourValues}",
  delete: "/admin/about/our-values/{ourValues}",
} as const;

export const adminTeamRoute = {
  get: "/admin/about/teams",
  create: "/admin/about/teams",
  update: "/admin/about/teams/{team}",
  delete: "/admin/about/teams/{team}",
} as const;

export const adminWhyChooseRoute = {
  get: "/admin/about/why-choose",
  create: "/admin/about/why-choose",
  update: "/admin/about/why-choose/{whyChoose}",
  delete: "/admin/about/why-choose/{whyChoose}",
} as const;



/** Website Routes */

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
