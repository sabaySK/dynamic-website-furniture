import { adminCertificationsRoute } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";
import { fetchAdminAbout } from "@/services/admin-service/about-us/about-us.service";

export interface CertificationItem {
  id: number | string;
  about_id: number;
  icon: string | null;
  title: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CertificationPage {
  list: CertificationItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
}

export interface CreateCertificationPayload {
  title: string;
  description: string | null;
  icon: File | string | null;
  about_id?: number;
}

export type UpdateCertificationPayload = CreateCertificationPayload;

function toObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function toNumber(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function mapCertification(raw: Record<string, unknown>, index: number): CertificationItem {
  return {
    id: (raw.id as number | string | undefined) ?? `certification-${index}`,
    about_id: toNumber(raw.about_id, 0),
    icon: raw.icon == null ? null : String(raw.icon),
    title: String(raw.title ?? ""),
    description: raw.description == null ? null : String(raw.description),
    created_at: raw.created_at == null ? null : String(raw.created_at),
    updated_at: raw.updated_at == null ? null : String(raw.updated_at),
  };
}

function extractRecord(res: unknown): Record<string, unknown> | null {
  const root = toObject(res);
  if (!root) return null;
  return (
    toObject(root.certification) ??
    toObject(root.certificate) ??
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

function buildBody(payload: CreateCertificationPayload, aboutId: number): FormData | Record<string, unknown> {
  const useFormData = typeof File !== "undefined" && payload.icon instanceof File;
  if (!useFormData) {
    return {
      about_id: aboutId,
      title: payload.title,
      description: payload.description,
      icon: payload.icon,
    };
  }

  const body = new FormData();
  body.append("about_id", String(aboutId));
  body.append("title", payload.title ?? "");
  body.append("description", payload.description ?? "");
  if (payload.icon instanceof File) body.append("icon", payload.icon);
  return body;
}

export async function fetchCertificationsPage(
  params: { page?: number; limit?: number } = {},
  config?: RequestConfig
): Promise<CertificationPage> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const res = await apiClient.get<any>(adminCertificationsRoute.get, {
    ...(config ?? {}),
    params: { page, limit },
  });

  const obj = toObject(res) ?? {};
  const rawList = Array.isArray(obj.list) ? obj.list : [];
  const list = rawList
    .filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
    .map(mapCertification);

  return {
    list,
    total: toNumber(obj.total, list.length),
    page: toNumber(obj.page, page),
    limit: toNumber(obj.limit, limit),
    offset: toNumber(obj.offset, (page - 1) * limit),
  };
}

export async function fetchCertifications(config?: RequestConfig): Promise<CertificationItem[]> {
  const { list } = await fetchCertificationsPage({ page: 1, limit: 100 }, config);
  return list;
}

export async function createCertification(
  payload: CreateCertificationPayload,
  config?: RequestConfig
): Promise<CertificationItem | null> {
  const aboutId = await resolveAboutId(payload.about_id, config);
  const body = buildBody(payload, aboutId);
  const res = await apiClient.post<any>(adminCertificationsRoute.create, body, config);
  const record = extractRecord(res);
  return record ? mapCertification(record, 0) : null;
}

export async function updateCertification(
  id: number | string,
  payload: UpdateCertificationPayload,
  config?: RequestConfig
): Promise<CertificationItem | null> {
  const endpoint = adminCertificationsRoute.update.replace("{certification}", encodeURIComponent(String(id)));
  const aboutId = await resolveAboutId(payload.about_id, config);
  const body = buildBody(payload, aboutId);
  const res = await apiClient.post<any>(endpoint, body, config);
  const record = extractRecord(res);
  return record ? mapCertification(record, 0) : null;
}

export async function deleteCertification(
  id: number | string,
  config?: RequestConfig
): Promise<{ success: boolean }> {
  const endpoint = adminCertificationsRoute.delete.replace("{certification}", encodeURIComponent(String(id)));
  try {
    await apiClient.delete<any>(endpoint, config);
  } catch {
    await apiClient.post<any>(endpoint, {}, config);
  }
  return { success: true };
}
