import { adminBannerRoute } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";

export type BannerStatus = "active" | "inactive";
export type BannerPosition = "home" | "shop" | "about_us" | "contact" | "blog";

export interface BannerItem {
  id: number | string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  link: string | null;
  position: string;
  status: BannerStatus;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface BannerPage {
  list: BannerItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
}

export interface CreateBannerPayload {
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  link: string | null;
  position: BannerPosition;
  status: BannerStatus;
  sort_order: number;
}
export type UpdateBannerPayload = CreateBannerPayload;

function toObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function toNumber(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeStatus(v: unknown): BannerStatus {
  return String(v).toLowerCase() === "inactive" ? "inactive" : "active";
}

function mapBanner(raw: Record<string, unknown>, index: number): BannerItem {
  return {
    id: (raw.id as number | string | undefined) ?? `banner-${index}`,
    title: String(raw.title ?? ""),
    subtitle: raw.subtitle == null ? null : String(raw.subtitle),
    description: raw.description == null ? null : String(raw.description),
    image: raw.image == null ? null : String(raw.image),
    link: raw.link == null ? null : String(raw.link),
    position: String(raw.position ?? ""),
    status: normalizeStatus(raw.status),
    sort_order: toNumber(raw.sort_order, 0),
    created_at: raw.created_at == null ? null : String(raw.created_at),
    updated_at: raw.updated_at == null ? null : String(raw.updated_at),
  };
}

function extractBannerRecord(res: unknown): Record<string, unknown> | null {
  const root = toObject(res);
  if (!root) return null;
  return (
    toObject(root.banner) ??
    toObject(root.data) ??
    toObject((toObject(root.data) ?? {}).banner) ??
    root
  );
}

export async function fetchBannersPage(
  params: { page?: number; limit?: number } = {},
  config?: RequestConfig
): Promise<BannerPage> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const res = await apiClient.get<any>(adminBannerRoute.get, {
    ...(config ?? {}),
    params: { page, limit },
  });

  const obj = toObject(res) ?? {};
  const rawList = Array.isArray(obj.list) ? obj.list : [];
  const list = rawList
    .filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
    .map(mapBanner);

  return {
    list,
    total: toNumber(obj.total, list.length),
    page: toNumber(obj.page, page),
    limit: toNumber(obj.limit, limit),
    offset: toNumber(obj.offset, (page - 1) * limit),
  };
}

export async function createBanner(
  payload: CreateBannerPayload,
  config?: RequestConfig
): Promise<BannerItem | null> {
  const res = await apiClient.post<any>(adminBannerRoute.create, payload, config);
  const record = extractBannerRecord(res);
  return record ? mapBanner(record, 0) : null;
}

export async function updateBanner(
  bannerId: number | string,
  payload: UpdateBannerPayload,
  config?: RequestConfig
): Promise<BannerItem | null> {
  const endpoint = adminBannerRoute.update.replace("{banner}", encodeURIComponent(String(bannerId)));
  try {
    const res = await apiClient.put<any>(endpoint, payload, config);
    const record = extractBannerRecord(res);
    return record ? mapBanner(record, 0) : null;
  } catch {
    const res = await apiClient.patch<any>(endpoint, payload, config);
    const record = extractBannerRecord(res);
    return record ? mapBanner(record, 0) : null;
  }
}

export async function deleteBanner(
  bannerId: number | string,
  config?: RequestConfig
): Promise<{ success: boolean }> {
  const endpoint = adminBannerRoute.delete.replace("{banner}", encodeURIComponent(String(bannerId)));
  try {
    await apiClient.delete<any>(endpoint, config);
  } catch {
    await apiClient.post<any>(endpoint, {}, config);
  }
  return { success: true };
}
