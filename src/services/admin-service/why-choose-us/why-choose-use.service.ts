import { adminWhyChooseRoute } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";
import { fetchAdminAbout } from "@/services/admin-service/about-us/about-us.service";

export interface WhyChooseItem {
  id: number | string;
  about_id: number;
  icon: string | null;
  content: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface WhyChoosePage {
  list: WhyChooseItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
}

export interface CreateWhyChoosePayload {
  content: string;
  icon: File | string | null;
  about_id?: number;
}

export type UpdateWhyChoosePayload = CreateWhyChoosePayload;

function toObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function toNumber(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function mapWhyChoose(raw: Record<string, unknown>, index: number): WhyChooseItem {
  return {
    id: (raw.id as number | string | undefined) ?? `why-choose-${index}`,
    about_id: toNumber(raw.about_id, 0),
    icon: raw.icon == null ? null : String(raw.icon),
    content: String(raw.content ?? ""),
    created_at: raw.created_at == null ? null : String(raw.created_at),
    updated_at: raw.updated_at == null ? null : String(raw.updated_at),
  };
}

function extractRecord(res: unknown): Record<string, unknown> | null {
  const root = toObject(res);
  if (!root) return null;
  return (
    toObject(root.why_choose) ??
    toObject(root.whyChoose) ??
    toObject(root.item) ??
    toObject(root.data) ??
    root
  );
}

async function resolveAboutId(payloadAboutId: number | undefined, config?: RequestConfig): Promise<number> {
  const about = await fetchAdminAbout(config);
  const aboutId = Number(about?.id);
  if (Number.isFinite(aboutId) && aboutId > 0) return aboutId;
  if (Number.isFinite(payloadAboutId) && Number(payloadAboutId) > 0) return Number(payloadAboutId);
  throw new Error("About record not found. Please create About first.");
}

function buildBody(payload: CreateWhyChoosePayload, aboutId: number): FormData | Record<string, unknown> {
  const useFormData = typeof File !== "undefined" && payload.icon instanceof File;
  if (!useFormData) {
    return {
      about_id: aboutId,
      content: payload.content,
      icon: payload.icon,
    };
  }

  const body = new FormData();
  body.append("about_id", String(aboutId));
  body.append("content", payload.content ?? "");
  if (payload.icon instanceof File) body.append("icon", payload.icon);
  return body;
}

export async function fetchWhyChoosePage(
  params: { page?: number; limit?: number } = {},
  config?: RequestConfig
): Promise<WhyChoosePage> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const res = await apiClient.get<any>(adminWhyChooseRoute.get, {
    ...(config ?? {}),
    params: { page, limit },
  });

  const obj = toObject(res) ?? {};
  const rawList = Array.isArray(obj.list) ? obj.list : [];
  const list = rawList
    .filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
    .map(mapWhyChoose);

  return {
    list,
    total: toNumber(obj.total, list.length),
    page: toNumber(obj.page, page),
    limit: toNumber(obj.limit, limit),
    offset: toNumber(obj.offset, (page - 1) * limit),
  };
}

export async function fetchWhyChoose(config?: RequestConfig): Promise<WhyChooseItem[]> {
  const { list } = await fetchWhyChoosePage({ page: 1, limit: 100 }, config);
  return list;
}

export async function createWhyChoose(
  payload: CreateWhyChoosePayload,
  config?: RequestConfig
): Promise<WhyChooseItem | null> {
  const aboutId = await resolveAboutId(payload.about_id, config);
  const body = buildBody(payload, aboutId);
  const res = await apiClient.post<any>(adminWhyChooseRoute.create, body, config);
  const record = extractRecord(res);
  return record ? mapWhyChoose(record, 0) : null;
}

export async function updateWhyChoose(
  id: number | string,
  payload: UpdateWhyChoosePayload,
  config?: RequestConfig
): Promise<WhyChooseItem | null> {
  const endpoint = adminWhyChooseRoute.update.replace("{whyChoose}", encodeURIComponent(String(id)));
  const aboutId = await resolveAboutId(payload.about_id, config);
  const body = buildBody(payload, aboutId);

  // Backend spec states update endpoint accepts POST.
  try {
    const res = await apiClient.post<any>(endpoint, body, config);
    const record = extractRecord(res);
    return record ? mapWhyChoose(record, 0) : null;
  } catch {
    const res = await apiClient.put<any>(endpoint, body as any, config);
    const record = extractRecord(res);
    return record ? mapWhyChoose(record, 0) : null;
  }
}

export async function deleteWhyChoose(
  id: number | string,
  config?: RequestConfig
): Promise<{ success: boolean }> {
  const endpoint = adminWhyChooseRoute.delete.replace("{whyChoose}", encodeURIComponent(String(id)));
  try {
    await apiClient.delete<any>(endpoint, config);
  } catch {
    await apiClient.post<any>(endpoint, {}, config);
  }
  return { success: true };
}
