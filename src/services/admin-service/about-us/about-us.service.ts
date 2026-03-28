import { adminAboutRoutes } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";

export interface AdminAboutItem {
  id: number | string;
  title: string | null;
  story_title: string | null;
  content: string | null;
  story: string | null;
  mission: string | null;
  vision: string | null;
  image: string | null;
  workshop_image: string[];
  created_at: string | null;
  updated_at: string | null;
}

export interface UpsertAdminAboutPayload {
  story_title?: string | null;
  title?: string | null;
  content?: string | null;
  story?: string | null;
  mission?: string | null;
  vision?: string | null;
  workshop_image?: Array<string | File>;
}

function toObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function mapAbout(raw: Record<string, unknown>): AdminAboutItem {
  return {
    id: (raw.id as number | string | undefined) ?? 0,
    title: raw.title == null ? null : String(raw.title),
    story_title: raw.story_title == null ? null : String(raw.story_title),
    content: raw.content == null ? null : String(raw.content),
    story: raw.story == null ? null : String(raw.story),
    mission: raw.mission == null ? null : String(raw.mission),
    vision: raw.vision == null ? null : String(raw.vision),
    image: raw.image == null ? null : String(raw.image),
    workshop_image: Array.isArray(raw.workshop_image)
      ? raw.workshop_image.map((x) => String(x))
      : [],
    created_at: raw.created_at == null ? null : String(raw.created_at),
    updated_at: raw.updated_at == null ? null : String(raw.updated_at),
  };
}

export async function fetchAdminAbout(config?: RequestConfig): Promise<AdminAboutItem | null> {
  const res = await apiClient.get<any>(adminAboutRoutes.get, config);
  const root = toObject(res);
  if (!root) return null;
  return mapAbout(root);
}

function hasFileList(values: unknown[] | undefined): boolean {
  return Array.isArray(values) && values.some((v) => typeof File !== "undefined" && v instanceof File);
}

export async function upsertAdminAbout(
  payload: UpsertAdminAboutPayload,
  config?: RequestConfig
): Promise<AdminAboutItem | null> {
  const withDefaults: UpsertAdminAboutPayload = {
    story_title: payload.story_title ?? null,
    title: payload.title ?? null,
    content: payload.content ?? null,
    story: payload.story ?? null,
    mission: payload.mission ?? null,
    vision: payload.vision ?? null,
    workshop_image: payload.workshop_image ?? [],
  };

  const workshop = withDefaults.workshop_image ?? [];
  const useFormData = hasFileList(workshop);

  const body: FormData | Record<string, unknown> = useFormData ? new FormData() : {};

  const write = (key: string, value: unknown) => {
    if (useFormData) {
      (body as FormData).append(key, value == null ? "" : String(value));
      return;
    }
    (body as Record<string, unknown>)[key] = value;
  };

  write("story_title", withDefaults.story_title);
  write("title", withDefaults.title);
  write("content", withDefaults.content);
  write("story", withDefaults.story);
  write("mission", withDefaults.mission);
  write("vision", withDefaults.vision);

  if (useFormData) {
    // Send both existing URLs and new files to preserve old images on update.
    for (const entry of workshop as Array<string | File>) {
      if (typeof File !== "undefined" && entry instanceof File) {
        (body as FormData).append("workshop_image[]", entry);
      } else {
        (body as FormData).append("workshop_image[]", String(entry));
      }
    }
  } else {
    write("workshop_image", workshop);
  }

  const res = await apiClient.post<any>(adminAboutRoutes.upsert, body, config);
  const root = toObject(res);
  if (!root) return null;
  return mapAbout(root);
}
