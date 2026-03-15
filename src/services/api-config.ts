/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints and settings.
 * Base URL is managed through VITE_API_BASE_URL in .env file
 */

/**
 * Base URL for the API
 * Set VITE_API_BASE_URL in your .env file
 * Example: VITE_API_BASE_URL=https://api.example.com/api
 * 
 * Defaults to empty string if not set (you should set it in .env)
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Rewrites cross-origin upload URLs to same-origin so images work without CORS.
 * Use for QR images, avatars, or any URL from the API that points to /uploads/.
 * Requires the server to proxy e.g. /api/uploads/ to the API's /uploads/.
 */
export function getSameOriginUploadUrl(fullUrl: string | undefined | null): string {
  if (!fullUrl || typeof fullUrl !== "string") return fullUrl ?? "";
  if (typeof window === "undefined") return fullUrl;
  try {
    const u = new URL(fullUrl);
    if (u.origin === window.location.origin) return fullUrl;
    if (u.pathname.startsWith("/uploads/")) {
      const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL || "/api";
      return `${window.location.origin}${base.startsWith("/") ? base : `/${base}`}${u.pathname}${u.search}`;
    }
  } catch {
    // ignore invalid URLs
  }
  return fullUrl;
}

/**
 * Default headers for all API requests
 */
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/**
 * Get authorization token from storage (localStorage)
 * This is the token received from /api/authorize endpoint
 */
export const getAuthorizationToken = (): string | null => {
  return localStorage.getItem("authorization_token");
};

/**
 * Get access token from storage (localStorage)
 * This is the token received from login (access_token)
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};

/**
 * Get authentication token from storage (localStorage/sessionStorage)
 * For general API authorization (Authorization header)
 */
export const getAuthToken = (): string | null => {
  // Use authorization_token for Authorization header, access_token for Auth header
  return getAuthorizationToken() || getAccessToken() || localStorage.getItem("authToken");
};

/**
 * Get headers with authentication tokens
 * Based on API requirements:
 * - "Auth": Access token from user login (access_token)
 * - "Authorization": Authorization token from /api/authorize endpoint
 */
export const getAuthHeaders = (): Record<string, string> => {
  const accessToken = getAccessToken();
  const authorizationToken = getAuthorizationToken();
  const headers: Record<string, string> = { ...DEFAULT_HEADERS };
  
  // Auth header: Access token from user login
  if (accessToken) {
    headers.Auth = accessToken;
  }
  
  // Authorization header: Authorization token from /api/authorize
  // API expects just the token, not "Bearer {token}"
  if (authorizationToken) {
    headers.Authorization = authorizationToken;
  }
  
  return headers;
};

/**
 * Save authorization token to storage (from /api/authorize)
 * @param token - Authorization token
 * @param expiredAt - Expiration timestamp (Unix timestamp in seconds)
 */
export const setAuthorizationToken = (token: string, expiredAt?: number): void => {
  if (token) {
    localStorage.setItem("authorization_token", token);
    if (expiredAt) {
      localStorage.setItem("authorization_token_expired_at", expiredAt.toString());
    }
  } else {
    localStorage.removeItem("authorization_token");
    localStorage.removeItem("authorization_token_expired_at");
  }
};

/**
 * Save access token to storage (from login)
 * @param token - Access token
 * @param expiredAt - Expiration timestamp (Unix timestamp in seconds)
 */
export const setAccessToken = (token: string, expiredAt?: number): void => {
  if (token) {
    localStorage.setItem("access_token", token);
    if (expiredAt) {
      localStorage.setItem("access_token_expired_at", expiredAt.toString());
    }
  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_token_expired_at");
  }
};

/**
 * Save auth token to storage (legacy)
 */
export const setAuthToken = (token: string): void => {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

/**
 * Get expiration timestamp for authorization token
 */
export const getAuthorizationTokenExpiredAt = (): number | null => {
  const expiredAt = localStorage.getItem("authorization_token_expired_at");
  return expiredAt ? parseInt(expiredAt, 10) : null;
};

/**
 * Get expiration timestamp for access token
 */
export const getAccessTokenExpiredAt = (): number | null => {
  const expiredAt = localStorage.getItem("access_token_expired_at");
  return expiredAt ? parseInt(expiredAt, 10) : null;
};

/**
 * Check if authorization token is expired
 * @returns true if token is expired or missing, false if valid
 */
export const isAuthorizationTokenExpired = (): boolean => {
  const expiredAt = getAuthorizationTokenExpiredAt();
  if (!expiredAt) {
    // No expiration stored, consider it expired for security
    return true;
  }
  // expiredAt is in seconds, Date.now() is in milliseconds
  const now = Math.floor(Date.now() / 1000);
  return expiredAt <= now;
};

/**
 * Check if access token is expired
 * @returns true if token is expired or missing, false if valid
 */
export const isAccessTokenExpired = (): boolean => {
  const expiredAt = getAccessTokenExpiredAt();
  if (!expiredAt) {
    // No expiration stored, consider it expired for security
    return true;
  }
  // expiredAt is in seconds, Date.now() is in milliseconds
  const now = Math.floor(Date.now() / 1000);
  return expiredAt <= now;
};

/**
 * Check if user is authenticated (has valid, non-expired access token)
 * This is a client-side check only. For full validation, use validateToken() to check with server.
 * @returns true if user has valid access token, false otherwise
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return false;
  }
  // Check if token is expired
  return !isAccessTokenExpired();
};

/**
 * Remove all authentication tokens from storage (logout)
 */
export const removeAuthTokens = (): void => {
  localStorage.removeItem("authorization_token");
  localStorage.removeItem("authorization_token_expired_at");
  localStorage.removeItem("access_token");
  localStorage.removeItem("access_token_expired_at");
  localStorage.removeItem("authToken");
};

/**
 * Clear expired tokens from storage
 * Called automatically to clean up expired tokens
 */
export const clearExpiredTokens = (): void => {
  if (isAuthorizationTokenExpired()) {
    localStorage.removeItem("authorization_token");
    localStorage.removeItem("authorization_token_expired_at");
  }
  if (isAccessTokenExpired()) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_token_expired_at");
    localStorage.removeItem("authToken");
  }
};

