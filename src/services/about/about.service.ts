import { apiClient } from "@/services/api-client";
import { aboutRoutes } from "@/services/api-route";
import type { RequestConfig } from "@/services/api-type";

export interface TeamMember {
  id: number;
  about_id?: number | null;
  name: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

export interface MediaItem {
  id?: number;
  url?: string;
  [key: string]: any;
}

export interface ChoiceItem {
  id: number;
  about_id?: number | null;
  icon?: string | null;
  content?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ValueItem {
  id: number;
  about_id?: number | null;
  icon?: string | null;
  title?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CertificationItem {
  id: number;
  about_id?: number | null;
  icon?: string | null;
  title?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AboutItem {
  id: number;
  title?: string | null;
  story_title?: string | null;
  content?: string | null;
  story?: string | null;
  mission?: string | null;
  vision?: string | null;
  image?: string | null;
  workshop_image?: string[] | null;
  team?: TeamMember[] | null;
  why_choose?: ChoiceItem[] | null;
  our_values?: ValueItem[] | null;
  certifications?: CertificationItem[] | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

/**
 * Fetch about information. API may return a single object, wrapped { success,data }, or an array.
 */
export const fetchAbout = async (config?: RequestConfig): Promise<AboutItem> => {
  const merged: RequestConfig = { skipAuth: true, ...(config ?? {}) };
  const res = await apiClient.get<any>(aboutRoutes.get, merged);

  if (Array.isArray(res)) {
    return res[0] as AboutItem;
  }

  if (res && typeof res === "object") {
    if ("data" in res && res.data && typeof res.data === "object") {
      return res.data as AboutItem;
    }
    return res as AboutItem;
  }

  return {} as AboutItem;
};

export default {
  fetchAbout,
};

