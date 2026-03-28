import { apiClient } from "@/services/api-client";
import { bannerRoutes } from "@/services/api-route";
import type { RequestConfig } from "@/services/api-type";

export interface BannerItem {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  image?: string | null;
  link?: string | null;
  position?: string | null;
  status?: string | null;
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

export interface BannerListResponse {
  list: BannerItem[];
  total?: number;
  total_active?: number;
  total_inactive?: number;
  total_by_position?: Record<string, number>;
  offset?: number;
  limit?: number;
  page?: number;
}

function normalizeUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return url ?? null;
  try {
    const parsed = new URL(url);
    const hostIsLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (hostIsLocal && typeof window !== "undefined") {
      const currentPort = window.location.port;
      if (currentPort && parsed.port === "") {
        parsed.port = currentPort;
        return parsed.toString();
      }
    }
  } catch {
    // not a full URL - return as-is
  }
  return url;
}

function normalizeBanner(raw: any): BannerItem {
  if (!raw || typeof raw !== "object") return raw as BannerItem;
  const b: BannerItem = { ...raw };
  if (b.image) b.image = normalizeUrl(b.image);
  return b;
}

const positionToRoute: Record<string, string> = {
  home: bannerRoutes.home,
  about: bannerRoutes.about,
  blog: bannerRoutes.blog,
  contact: bannerRoutes.contact,
  shop: bannerRoutes.shop,
};

export const fetchBanners = async (position?: string, config?: RequestConfig): Promise<BannerListResponse> => {
  const merged: RequestConfig = { skipAuth: true, ...(config ?? {}) };
  let endpoint: string = bannerRoutes.home;
  if (position && positionToRoute[position]) endpoint = positionToRoute[position];

  const res = await apiClient.get<any>(endpoint, merged);
  const data = res && typeof res === "object" && "data" in res ? res.data : res;
  const listRaw: any[] = data?.list ?? [];
  const list = Array.isArray(listRaw) ? listRaw.map(normalizeBanner) : [];

  return {
    list,
    total: data?.total ?? undefined,
    total_active: data?.total_active ?? undefined,
    total_inactive: data?.total_inactive ?? undefined,
    total_by_position: data?.total_by_position ?? undefined,
    offset: data?.offset ?? undefined,
    limit: data?.limit ?? undefined,
    page: data?.page ?? undefined,
  };
};

export const fetchBannersForPosition = async (position: string, config?: RequestConfig) => {
  return fetchBanners(position, config);
};

export default {
  fetchBanners,
  fetchBannersForPosition,
};

