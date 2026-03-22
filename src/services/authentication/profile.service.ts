import { authRoutes } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";

export interface ProfileUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  email_verified_at?: string | null;
  role?: string;
  status?: string;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfilePayload {
  message?: string;
  user?: ProfileUser | null;
}

/** Walk nested `{ data: ... }` layers and pick `user` or a plain user-shaped object. */
function extractUserFromProfileResponse(res: unknown): { message: string; user: ProfileUser | null } {
  let cur: unknown = res;
  for (let depth = 0; depth < 8 && cur && typeof cur === "object"; depth++) {
    const o = cur as Record<string, unknown>;

    const msg = o.message;
    const message = typeof msg === "string" ? msg : "";

    const u = o.user;
    if (u && typeof u === "object" && u !== null && !Array.isArray(u)) {
      return { message, user: u as ProfileUser };
    }

    const direct = looksLikeUserRecord(o);
    if (direct) {
      return { message, user: o as unknown as ProfileUser };
    }

    if ("data" in o && o.data != null) {
      cur = o.data;
      continue;
    }
    break;
  }
  return { message: "", user: null };
}

function looksLikeUserRecord(o: Record<string, unknown>): boolean {
  if ("user" in o && o.user) return false;
  const idOk = typeof o.id === "number" || typeof o.id === "string";
  const hasContact =
    typeof o.email === "string" ||
    typeof o.phone === "string" ||
    typeof o.name === "string";
  const namedEmail =
    typeof o.name === "string" && (typeof o.email === "string" || typeof o.phone === "string");
  return (idOk && hasContact) || namedEmail;
}

export async function fetchProfile(config?: RequestConfig): Promise<ProfilePayload> {
  const res = await apiClient.get<any>(authRoutes.profile, config);
  const { message, user } = extractUserFromProfileResponse(res);
  return { message, user };
}

/**
 * Update profile on the server.
 * Accepts a partial ProfileUser payload (name, email, phone, image, etc).
 */
export async function updateProfile(payload: Partial<ProfileUser>, config?: RequestConfig): Promise<ProfilePayload> {
  const res = await apiClient.put<any>(authRoutes.profile, payload, { ...(config ?? {}) });
  const data = res && typeof res === "object" && "data" in res ? res.data : res;

  const rawUser = data?.user ?? data ?? null;
  const user: ProfileUser | null = rawUser ? (rawUser as ProfileUser) : null;

  return {
    message: data?.message ?? "",
    user,
  };
}

export default {
  fetchProfile,
  updateProfile,
};
