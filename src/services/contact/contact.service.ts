import { apiClient } from "@/services/api-client";
import { contactRoutes } from "@/services/api-route";
import type { RequestConfig } from "@/services/api-type";

export interface ContactSocialMedia {
  facebook?: string | null;
  telegram?: string | null;
  instagram?: string | null;
  [key: string]: any;
}

export interface ContactItem {
  id: number;
  company_name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  lat?: number | null;
  lang?: number | null;
  social_media?: ContactSocialMedia | null;
  social_media_icons?: {
    facebook?: string | null;
    instagram?: string | null;
    telegram?: string | null;
    [key: string]: any;
  } | null;
  working_hours?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

/**
 * Fetch contact information.
 * API may return:
 * - a single object: { id, company_name, ... }
 * - wrapped: { success: true, data: { ... } }
 * - array: [ { ... } ] -> take first element
 */
export const fetchContact = async (config?: RequestConfig): Promise<ContactItem> => {
  const mergedConfig: RequestConfig = { skipAuth: true, ...(config ?? {}) };
  const res = await apiClient.get<any>(contactRoutes.get, mergedConfig);

  if (Array.isArray(res)) {
    return res[0] as ContactItem;
  }

  if (res && typeof res === "object") {
    if ("data" in res && res.data && typeof res.data === "object") {
      return res.data as ContactItem;
    }
    return res as ContactItem;
  }

  return {} as ContactItem;
};

export const fetchContactById = async (id: number | string): Promise<ContactItem> => {
  const endpoint = `${contactRoutes.get}/${id}`;
  return apiClient.get<ContactItem>(endpoint, { skipAuth: true });
};

export default {
  fetchContact,
};

