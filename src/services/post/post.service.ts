import { apiClient } from "@/services/api-client";
import { postRoutes } from "@/services/api-route";
import type { RequestConfig } from "@/services/api-type";

export interface PostItem {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  featured_image?: string | null;
  author?: string | null;
  author_role?: string | null;
  subtitle?: string | null;
  tag?: string[] | string | null;
  count_red?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

export interface PostListResponse {
  list: PostItem[];
  total?: number;
  limit?: number;
  page?: number;
}

/**
 * Normalize localhost URLs to include current browser port if missing.
 */
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
    // not a full URL, return as-is
  }
  return url;
}

function normalizePost(raw: any): PostItem {
  if (!raw || typeof raw !== "object") return raw as PostItem;
  const post: PostItem = { ...raw };
  if (post.featured_image) {
    post.featured_image = normalizeUrl(post.featured_image);
  }
  // tag may be an array, string, or JSON-encoded string
  if (post.tag && typeof post.tag === "string") {
    try {
      const parsed = JSON.parse(post.tag);
      if (Array.isArray(parsed)) post.tag = parsed;
    } catch {
      // keep as string if not JSON
    }
  }
  // Normalize read/count fields from API (some responses use count_red)
  const rawCount = (raw && (raw.count_red ?? raw.count_read ?? raw.readCount ?? raw.read_time ?? raw.readTime)) ?? undefined;
  if (rawCount !== undefined) {
    (post as any).readTime = rawCount;
  }
  return post;
}

export const fetchPosts = async (config?: RequestConfig): Promise<PostListResponse> => {
  const merged: RequestConfig = { skipAuth: true, ...(config ?? {}) };
  const res = await apiClient.get<any>(postRoutes.get, merged);

  // Handle wrapped responses: { success, data: { list: [...] } } or direct { list: [...] }
  const data = res && typeof res === "object" && "data" in res ? res.data : res;
  const listRaw: any[] = data?.list ?? data ?? [];
  const list = Array.isArray(listRaw) ? listRaw.map(normalizePost) : [];

  return {
    list,
    total: data?.total ?? undefined,
    limit: data?.limit ?? undefined,
    page: data?.page ?? undefined,
  };
};

export const fetchPostById = async (id: number | string, config?: RequestConfig): Promise<PostItem> => {
  const endpoint = `${postRoutes.get}/${id}`;
  const res = await apiClient.get<any>(endpoint, { skipAuth: true, ...(config ?? {}) });
  const data = res && typeof res === "object" && "data" in res ? res.data : res;
  return normalizePost(data);
};

export const markPostAsRead = async (id: number | string, config?: RequestConfig) => {
  // postRoutes.read is "/websites/posts/{post}/read"
  const endpoint = postRoutes.read.replace("{post}", String(id));
  return apiClient.post(endpoint, undefined, { skipAuth: true, ...(config ?? {}) });
};

export default {
  fetchPosts,
  fetchPostById,
  markPostAsRead,
};

