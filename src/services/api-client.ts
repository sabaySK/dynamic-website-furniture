/**
 * API Client
 * 
 * Global API service with GET, POST, PUT, DELETE methods.
 * Handles authentication, error handling, and response parsing.
 */

import { API_BASE_URL, getAuthHeaders, DEFAULT_HEADERS } from "./api-config";
import type { ApiResponse, ApiError, RequestConfig } from "./api-type";
import { reportServerError, reportServerSuccess } from "../hooks/use-server-status";
import { removeAuthTokens } from "./api-config";

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>
  ) {
    // Ensure message is always a string
    const safeMessage = typeof message === "string" ? message : String(message || "An error occurred");
    super(safeMessage);
    this.name = "ApiClientError";
    this.message = safeMessage;
  }
}

/**
 * Build URL with query parameters
 * Handles trailing slashes properly to avoid double slashes
 */
const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean>): string => {
  let url: string;
  
  if (endpoint.startsWith("http")) {
    // Full URL provided
    url = endpoint;
  } else {
    // Build URL from base URL and endpoint
    const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    url = `${baseUrl}${cleanEndpoint}`;
  }
  
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  return `${url}?${searchParams.toString()}`;
};

/**
 * Handle API response and parse JSON
 */
const handleResponse = async <T>(response: Response, config?: RequestConfig): Promise<T> => {
  // Handle 400 from notification/send before parsing so we never throw (e.g. "No active FCM tokens", validation)
  const isNotificationSend400 =
    !response.ok &&
    response.status === 400 &&
    (response.url.includes("notification/send") || response.url.includes("notification%2Fsend"));
  if (isNotificationSend400) {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    let data: unknown;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch {
      data = await response.text();
    }
    const body = typeof data === "object" && data !== null ? data : { success: false, message: String(data ?? "Bad Request") };
    return body as T;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  
  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }
  
  // Parse JSON response
  const data = isJson ? await response.json() : await response.text();

  // Debug: Log error responses for troubleshooting (skip 404s as they're often expected)
  if (import.meta.env.DEV && !response.ok && response.status !== 404) {
    console.error("API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      body: data,
    });
  }
  
  // Handle error responses
  if (!response.ok) {
    // Extract error message from various possible response formats
    let errorMessage = `HTTP Error: ${response.statusText}`;
    
    if (data && typeof data === "object") {
      // Helper function to extract string from value (handles objects)
      const extractString = (value: any): string | null => {
        if (typeof value === "string") return value;
        if (typeof value === "object" && value !== null) {
          // If it's an object, try to get first string value
          const values = Object.values(value);
          for (const val of values) {
            if (typeof val === "string") return val;
            if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
              return val[0];
            }
          }
        }
        return null;
      };
      
      // Try different error message fields (handle objects)
      // For 412 Precondition Failed, the message might be nested
      let possibleMessage = 
        extractString(data.message) ||
        extractString(data.error) ||
        extractString(data.errors) ||
        (typeof data.errors === "string" ? data.errors : null) ||
        extractString(data.msg) ||
        null;
      
      // If message is an object, try to extract from common fields
      if (!possibleMessage && data.message && typeof data.message === "object") {
        possibleMessage = 
          extractString(data.message.message) ||
          extractString(data.message.error) ||
          extractString(data.message.msg) ||
          (data.message.text && typeof data.message.text === "string" ? data.message.text : null) ||
          null;
      }
      
      if (possibleMessage) {
        errorMessage = possibleMessage;
      }
      
      // Handle validation errors - ensure we extract strings
      if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
        const validationErrors = Object.values(data.errors).flat();
        if (validationErrors.length > 0) {
          // Get first error and ensure it's a string
          const firstError = validationErrors[0];
          if (typeof firstError === "string") {
            errorMessage = firstError;
          } else if (typeof firstError === "object" && firstError !== null) {
            // If it's an object, try to extract a message or convert to string
            errorMessage = (firstError as any).message || JSON.stringify(firstError);
          }
        }
      }
      
      // Ensure errorMessage is always a string
      if (typeof errorMessage !== "string") {
        errorMessage = String(errorMessage) || `HTTP Error: ${response.statusText}`;
      }
    } else if (typeof data === "string") {
      errorMessage = data;
    }
    
    const error: ApiError = {
      message: errorMessage,
      error: data?.error,
      statusCode: response.status,
      errors: data?.errors,
    };
    
    // Handle 401 Unauthorized - token is invalid or expired, force logout
    if (response.status === 401 && !config?.suppress401Redirect) {
      // Clear all authentication tokens
      removeAuthTokens();

      // Redirect to auth page if we're in the browser and not already on an auth page
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        // Treat both /login and /auth as auth entry points to avoid redirecting away
        const authPaths = ["/login", "/auth"];
        const isOnAuthPage = authPaths.some((p) => currentPath.includes(p));

        // Only redirect when we're not already on an auth page to avoid nested redirects
        if (!isOnAuthPage) {
          // Store current location for redirect after login
          const fullPath = currentPath + window.location.search;
          // Use a small timeout to avoid navigation during error handling
          setTimeout(() => {
            // Prefer the app's `/auth` route as the canonical login entry point
            const loginRoute = "/auth";
            window.location.href = `${loginRoute}?redirect=${encodeURIComponent(fullPath)}`;
          }, 100);
        }
      }
    }
    
    // Report server errors (5xx) to server status monitor
    if (response.status >= 500 && response.status < 600) {
      reportServerError(response.status, new Error(errorMessage));
    }
    
    throw new ApiClientError(error.message, error.statusCode, error.errors);
  }
  
  // Return data from ApiResponse wrapper if it exists, otherwise return data directly
  if (data && typeof data === "object" && "data" in data) {
    // Handle both ApiResponse format and success/data format
    const responseData = (data as ApiResponse<T>).data ?? (data as any).data;
    
    // Debug: Log unwrapping for news and events endpoints (only in development)
    if (import.meta.env.DEV && (response.url.includes("/news/list") || response.url.includes("/event/list") || response.url.includes("/event/show"))) {
      console.log("API Response unwrapping:", {
        endpoint: response.url,
        original: data,
        unwrapped: responseData,
        hasDataField: "data" in data,
      });
    }
    
    return responseData ?? data;
  }
  
  return data as T;
};

/**
 * Base request method
 */
const request = async <T>(
  endpoint: string,
  method: string,
  body?: any,
  config?: RequestConfig
): Promise<T> => {
  const url = buildUrl(endpoint, config?.params);
  const isNotificationSend =
    endpoint.includes("notification/send") ||
    url.includes("notification/send") ||
    url.includes("notification%2Fsend");

  // Only add auth headers if not skipped (for login/public endpoints)
  const baseHeaders = config?.skipAuth 
    ? DEFAULT_HEADERS 
    : getAuthHeaders();
  
  const headers = {
    ...baseHeaders,
    ...config?.headers,
  };
  
  const requestOptions: RequestInit = {
    method,
    headers,
    signal: config?.signal,
  };
  
  // Add body for POST, PUT, PATCH, or DELETE (when config.body provided)
  const bodyToSend = body ?? config?.body;
  if (bodyToSend && (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE")) {
    // If body is FormData, send it directly (don't stringify, don't set Content-Type header)
    if (bodyToSend instanceof FormData) {
      requestOptions.body = bodyToSend;
      // Remove Content-Type header for FormData - browser will set it with boundary
      delete (headers as any)['Content-Type'];
    } else {
      requestOptions.body = JSON.stringify(bodyToSend);
    }
  }
  
  // Debug logging (remove in production). Skip for notification/send to reduce console noise (400 "no FCM tokens" is handled and non-fatal).
  if (import.meta.env.DEV && !isNotificationSend) {
    const authHeader = (headers as Record<string, string>).Authorization;
    console.log("API Request:", {
      method,
      url,
      headers: {
        ...headers,
        Authorization: authHeader ? `${authHeader.substring(0, 20)}...` : undefined,
        Auth: (headers as Record<string, string>).Auth ? "***" : undefined,
      },
      body: bodyToSend ? (typeof bodyToSend === "string" ? bodyToSend : JSON.stringify(bodyToSend)) : undefined,
    });
  }

  try {
    const response = await fetch(url, requestOptions);
    const result = await handleResponse<T>(response, config);
    
    // Report server success (server is up and responding)
    reportServerSuccess();
    
    return result;
  } catch (error) {
    // Handle network errors or other fetch errors
    if (error instanceof ApiClientError) {
      // Check if it's a server error (5xx)
      if (error.statusCode && error.statusCode >= 500 && error.statusCode < 600) {
        reportServerError(error.statusCode, error);
      }
      throw error;
    }
    
    // Check for connection errors that indicate server down
    const errorMessage = error instanceof Error ? error.message : "Network error occurred";
    const isConnectionError =
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("NetworkError") ||
      errorMessage.includes("connection refused") ||
      errorMessage.includes("ECONNREFUSED");
    
    // Only report as server down if we're online but can't connect
    if (isConnectionError && typeof navigator !== "undefined" && navigator.onLine) {
      reportServerError(0, error instanceof Error ? error : new Error(errorMessage));
    }
    
    throw new ApiClientError(errorMessage, 0);
  }
};

/**
 * API Client with common HTTP methods
 */
export const apiClient = {
  /**
   * GET request - Fetch data from the server
   * @param endpoint - API endpoint (e.g., "/users" or "/bookings")
   * @param config - Optional request configuration (params, headers, signal)
   * @returns Promise with response data
   * 
   * @example
   * ```ts
   * // Simple GET request
   * const users = await apiClient.get<User[]>("/users");
   * 
   * // GET with query parameters
   * const bookings = await apiClient.get<Booking[]>("/bookings", {
   *   params: { status: "pending", page: 1, limit: 10 }
   * });
   * ```
   */
  get: <T = any>(endpoint: string, config?: RequestConfig): Promise<T> => {
    return request<T>(endpoint, "GET", undefined, config);
  },

  /**
   * POST request - Create new resource
   * @param endpoint - API endpoint
   * @param body - Request body data
   * @param config - Optional request configuration
   * @returns Promise with response data
   * 
   * @example
   * ```ts
   * const newBooking = await apiClient.post<Booking>("/bookings", {
   *   first_name: "John",
   *   last_name: "Doe",
   *   service_type: "maintenance"
   * });
   * ```
   */
  post: <T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> => {
    return request<T>(endpoint, "POST", body, config);
  },

  /**
   * PUT request - Update entire resource
   * @param endpoint - API endpoint (usually includes ID, e.g., "/bookings/123")
   * @param body - Request body data with all fields
   * @param config - Optional request configuration
   * @returns Promise with response data
   * 
   * @example
   * ```ts
   * const updatedBooking = await apiClient.put<Booking>("/bookings/123", {
   *   id: 123,
   *   status: "completed",
   *   admin_comment: "Service completed successfully"
   * });
   * ```
   */
  put: <T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> => {
    return request<T>(endpoint, "PUT", body, config);
  },

  /**
   * DELETE request - Delete resource
   * @param endpoint - API endpoint (usually includes ID, e.g., "/bookings/123")
   * @param config - Optional request configuration
   * @returns Promise with response data (usually empty or success message)
   * 
   * @example
   * ```ts
   * await apiClient.delete("/bookings/123");
   * ```
   */
  delete: <T = any>(endpoint: string, config?: RequestConfig): Promise<T> => {
    return request<T>(endpoint, "DELETE", undefined, config);
  },

  /**
   * PATCH request - Partial update of resource
   * @param endpoint - API endpoint (usually includes ID)
   * @param body - Request body with only fields to update
   * @param config - Optional request configuration
   * @returns Promise with response data
   * 
   * @example
   * ```ts
   * const updated = await apiClient.patch<Booking>("/bookings/123", {
   *   status: "completed"
   * });
   * ```
   */
  patch: <T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> => {
    return request<T>(endpoint, "PATCH", body, config);
  },
};

export default apiClient;

