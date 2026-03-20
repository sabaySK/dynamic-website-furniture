import { apiClient } from "@/services/api-client";
import { showroomRoutes } from "@/services/api-route";

export interface ShowroomImage {
  media_id: number;
  url: string;
}

export interface ShowroomItem {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  google_map_url?: string | null;
  opening_hours?: string | null;
  date?: string | null;
  // API may return image as an object (media) or an ID (number)
  image?: ShowroomImage | number | null;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Fetch showroom (API returns a single showroom object under `data`).
 * We keep the exported name `fetchShowrooms` for backwards compatibility,
 * but it returns a single ShowroomItem (not a paginated list).
 */
export const fetchShowrooms = async (): Promise<ShowroomItem> => {
  const res = await apiClient.get<any>(showroomRoutes.get, {
    skipAuth: true,
  });

  // apiClient may unwrap ApiResponse and return the inner `data` automatically.
  // Normalize common shapes:
  // - direct object: { id, name, ... }
  // - wrapped: { success: true, data: { ... } }
  // - array (unexpected): [ {...} ] -> take first
  if (Array.isArray(res)) {
    return res[0] as ShowroomItem;
  }

  if (res && typeof res === "object") {
    // If it's in { data: {...} } form (unwrapped or not), prefer that.
    if ("data" in res && res.data && typeof res.data === "object") {
      return res.data as ShowroomItem;
    }
    return res as ShowroomItem;
  }

  // Fallback empty object cast
  return {} as ShowroomItem;
};

export const fetchShowroomById = async (id: number | string) => {
  const endpoint = `${showroomRoutes.get}/${id}`;
  return apiClient.get<ShowroomItem>(endpoint, { skipAuth: true });
};

export default {
  fetchShowrooms,
};

