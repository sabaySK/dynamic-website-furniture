import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "@/services/api-config";

interface ServerStatus {
  isServerDown: boolean;
  wasServerDown: boolean;
}

/**
 * Hook to monitor server availability
 * Detects server down status based on API responses
 * 
 * @param healthCheckEndpoint Optional endpoint to ping for health checks (default: disabled)
 * @param healthCheckInterval Interval in ms to check server health (default: 30000 = 30 seconds)
 * @returns Server status object with isServerDown and wasServerDown flags
 */
export function useServerStatus(
  healthCheckEndpoint?: string,
  healthCheckInterval: number = 30000
): ServerStatus {
  const [isServerDown, setIsServerDown] = useState<boolean>(false);
  const [wasServerDown, setWasServerDown] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveFailuresRef = useRef<number>(0);
  const isCheckingRef = useRef<boolean>(false);

  // Function to check server health
  const checkServerHealth = useCallback(async (): Promise<boolean> => {
    if (!healthCheckEndpoint || isCheckingRef.current) {
      return !isServerDown; // Return current status if no endpoint or already checking
    }

    isCheckingRef.current = true;

    try {
      const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL || "/api";
      const path = healthCheckEndpoint.startsWith("/") ? healthCheckEndpoint : `/${healthCheckEndpoint}`;
      const url = healthCheckEndpoint.startsWith("http")
        ? healthCheckEndpoint
        : `${base}${path}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, {
        method: "HEAD",
        cache: "no-cache",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      isCheckingRef.current = false;

      if (response.ok || response.status < 500) {
        // Server is up (2xx, 3xx, 4xx are OK - means server is responding)
        consecutiveFailuresRef.current = 0;
        return true;
      } else {
        // Server returned 5xx error
        consecutiveFailuresRef.current += 1;
        return false;
      }
    } catch (error: any) {
      isCheckingRef.current = false;
      
      // Check if it's a network error that's not just "offline"
      // Connection refused, timeout, etc. indicate server down
      const errorMessage = error?.message?.toLowerCase() || "";
      const isServerError =
        errorMessage.includes("failed to fetch") ||
        errorMessage.includes("networkerror") ||
        errorMessage.includes("connection refused") ||
        errorMessage.includes("econnrefused") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("aborted");

      // Only count as server down if we have internet (navigator.onLine) but can't reach server
      if (isServerError && typeof navigator !== "undefined" && navigator.onLine) {
        consecutiveFailuresRef.current += 1;
        return false;
      }

      // If offline, don't count as server down
      return true;
    }
  }, [healthCheckEndpoint, isServerDown]);

  // Function to update server status based on API response
  const handleServerError = useCallback((statusCode?: number, error?: Error) => {
    // Check for server errors (5xx) or connection errors
    const isError = statusCode !== undefined && statusCode >= 500 && statusCode < 600;
    const isConnectionError =
      error &&
      typeof navigator !== "undefined" &&
      navigator.onLine &&
      (error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError") ||
        error.message.includes("connection refused") ||
        error.message.includes("ECONNREFUSED"));

    if (isError || isConnectionError) {
      setIsServerDown((prev) => {
        if (!prev) {
          setWasServerDown(true);
          return true;
        }
        return prev;
      });
    }
  }, []);

  // Function to mark server as up
  const markServerUp = useCallback(() => {
    setIsServerDown((prev) => {
      if (prev) {
        setWasServerDown(false);
        consecutiveFailuresRef.current = 0;
        return false;
      }
      return prev;
    });
  }, []);

  // Expose handler for API client to use
  useEffect(() => {
    // Store handlers in window for API client to access
    (window as any).__serverStatusHandler = {
      handleServerError,
      markServerUp,
    };

    return () => {
      delete (window as any).__serverStatusHandler;
    };
  }, [handleServerError, markServerUp]);

  // Periodic health check if endpoint provided
  useEffect(() => {
    if (!healthCheckEndpoint) {
      return;
    }

    // Initial check
    checkServerHealth().then((isUp) => {
      if (isUp) {
        markServerUp();
      } else {
        handleServerError(503);
      }
    });

    // Set up periodic checking
    intervalRef.current = setInterval(async () => {
      // Only check if we think server is down or after a few consecutive failures
      if (isServerDown || consecutiveFailuresRef.current > 0) {
        const isUp = await checkServerHealth();
        
        // Require 2 consecutive successful checks to mark as up
        if (isUp) {
          if (consecutiveFailuresRef.current > 0) {
            consecutiveFailuresRef.current = Math.max(0, consecutiveFailuresRef.current - 1);
          }
          
          if (consecutiveFailuresRef.current === 0 && isServerDown) {
            markServerUp();
          }
        } else {
          handleServerError(503);
        }
      }
    }, healthCheckInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [healthCheckEndpoint, healthCheckInterval, isServerDown, checkServerHealth, handleServerError, markServerUp]);

  // Listen to online events to re-check server status
  useEffect(() => {
    const handleOnline = async () => {
      // When coming back online, check server status
      if (healthCheckEndpoint) {
        const isUp = await checkServerHealth();
        if (isUp) {
          markServerUp();
        }
      }
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [healthCheckEndpoint, checkServerHealth, markServerUp]);

  return { isServerDown, wasServerDown };
}

/**
 * Helper function to be called from API client when server errors occur
 * This is called automatically by intercepting API responses
 */
export const reportServerError = (statusCode?: number, error?: Error) => {
  const handler = (window as any).__serverStatusHandler;
  if (handler) {
    handler.handleServerError(statusCode, error);
  }
};

/**
 * Helper function to mark server as back online
 * This is called when API requests succeed after server was down
 */
export const reportServerSuccess = () => {
  const handler = (window as any).__serverStatusHandler;
  if (handler) {
    handler.markServerUp();
  }
};

