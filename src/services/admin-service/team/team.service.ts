import { adminTeamRoute } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";
import { fetchAdminAbout } from "@/services/admin-service/about-us/about-us.service";

export interface TeamItem {
  id: number | string;
  about_id: number;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TeamPage {
  list: TeamItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
}

export interface CreateTeamPayload {
  name: string;
  description: string | null;
  about_id?: number;
}

export type UpdateTeamPayload = CreateTeamPayload;

function toObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function toNumber(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function mapTeam(raw: Record<string, unknown>, index: number): TeamItem {
  return {
    id: (raw.id as number | string | undefined) ?? `team-${index}`,
    about_id: toNumber(raw.about_id, 0),
    name: String(raw.name ?? ""),
    description: raw.description == null ? null : String(raw.description),
    created_at: raw.created_at == null ? null : String(raw.created_at),
    updated_at: raw.updated_at == null ? null : String(raw.updated_at),
  };
}

function extractTeamRecord(res: unknown): Record<string, unknown> | null {
  const root = toObject(res);
  if (!root) return null;
  return (
    toObject(root.team) ??
    toObject(root.data) ??
    toObject((toObject(root.data) ?? {}).team) ??
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

export async function fetchTeamsPage(
  params: { page?: number; limit?: number } = {},
  config?: RequestConfig
): Promise<TeamPage> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const res = await apiClient.get<any>(adminTeamRoute.get, {
    ...(config ?? {}),
    params: { page, limit },
  });

  const obj = toObject(res) ?? {};
  const rawList = Array.isArray(obj.list) ? obj.list : [];
  const list = rawList
    .filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
    .map(mapTeam);

  return {
    list,
    total: toNumber(obj.total, list.length),
    page: toNumber(obj.page, page),
    limit: toNumber(obj.limit, limit),
    offset: toNumber(obj.offset, (page - 1) * limit),
  };
}

export async function fetchTeams(config?: RequestConfig): Promise<TeamItem[]> {
  const { list } = await fetchTeamsPage({ page: 1, limit: 100 }, config);
  return list;
}

export async function createTeam(
  payload: CreateTeamPayload,
  config?: RequestConfig
): Promise<TeamItem | null> {
  const aboutId = await resolveAboutId(payload.about_id, config);
  const body = {
    ...payload,
    about_id: aboutId,
  };
  const res = await apiClient.post<any>(adminTeamRoute.create, body, config);
  const record = extractTeamRecord(res);
  return record ? mapTeam(record, 0) : null;
}

export async function updateTeam(
  teamId: number | string,
  payload: UpdateTeamPayload,
  config?: RequestConfig
): Promise<TeamItem | null> {
  const endpoint = adminTeamRoute.update.replace("{team}", encodeURIComponent(String(teamId)));
  const aboutId = await resolveAboutId(payload.about_id, config);
  const body = {
    ...payload,
    about_id: aboutId,
  };
  try {
    const res = await apiClient.put<any>(endpoint, body, config);
    const record = extractTeamRecord(res);
    return record ? mapTeam(record, 0) : null;
  } catch {
    const res = await apiClient.patch<any>(endpoint, body, config);
    const record = extractTeamRecord(res);
    return record ? mapTeam(record, 0) : null;
  }
}

export async function deleteTeam(
  teamId: number | string,
  config?: RequestConfig
): Promise<{ success: boolean }> {
  const endpoint = adminTeamRoute.delete.replace("{team}", encodeURIComponent(String(teamId)));
  try {
    await apiClient.delete<any>(endpoint, config);
  } catch {
    await apiClient.post<any>(endpoint, {}, config);
  }
  return { success: true };
}
