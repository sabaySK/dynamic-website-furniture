import { customerRoute } from "@/services/api-route";
import { apiClient } from "@/services/api-client";
import type { RequestConfig } from "@/services/api-type";

export type CustomerStatus = "active" | "inactive";

export interface CustomerItem {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  email_verified_at?: string | null;
  role?: string | null;
  status: CustomerStatus;
  image?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

function normalizeStatus(value: unknown): CustomerStatus {
  return String(value).toLowerCase() === "inactive" ? "inactive" : "active";
}

function toObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function extractList(res: unknown): Record<string, unknown>[] {
  // apiClient unwraps `{ data: ... }`, so after unwrapping we might receive:
  // - `{ list: [...] }` (most common for `/admin/customers`)
  // - `{ data: { list: [...] } }` (if apiClient is not unwrapping)
  // - or even a raw array
  if (Array.isArray(res)) {
    return res.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null);
  }

  const root = toObject(res);
  if (!root) return [];

  const directList = (root as any).list;
  if (Array.isArray(directList)) {
    return directList.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null);
  }

  const nested = toObject((root as any).data);
  const nestedList = nested?.list;
  if (Array.isArray(nestedList)) {
    return nestedList.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null);
  }

  const candidates = [(root as any).customers, (root as any).items, (root as any).data];
  for (const c of candidates) {
    if (Array.isArray(c)) {
      return c.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null);
    }
    const obj = toObject(c);
    const maybeList = obj && (obj as any).list;
    if (Array.isArray(maybeList)) {
      return maybeList.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null);
    }
  }

  return [];
}

function num(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function extractMeta(res: unknown): { total: number; page: number; limit: number; offset: number } {
  const root = toObject(res);
  if (!root) return { total: 0, page: 1, limit: 10, offset: 0 };
  return {
    total: num(root.total, 0),
    page: num(root.page, 1),
    limit: num(root.limit, 10),
    offset: num(root.offset, 0),
  };
}

function mapCustomer(raw: Record<string, unknown>, fallbackIndex: number): CustomerItem {
  return {
    id: (raw.id as number | string | undefined) ?? `c-${fallbackIndex}`,
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? ""),
    email_verified_at: raw.email_verified_at == null ? null : String(raw.email_verified_at),
    role: raw.role == null ? null : String(raw.role),
    status: normalizeStatus(raw.status),
    image: raw.image == null ? null : String(raw.image),
    created_at: raw.created_at == null ? null : String(raw.created_at),
    updated_at: raw.updated_at == null ? null : String(raw.updated_at),
  };
}

export type CustomersPage = {
  items: CustomerItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
};

export async function fetchCustomersPage(
  params: { page?: number; limit?: number },
  config?: RequestConfig
): Promise<CustomersPage> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const res = await apiClient.get<any>(customerRoute.get, {
    ...(config ?? {}),
    params: { page, limit },
  });
  const items = extractList(res).map(mapCustomer);
  const meta = extractMeta(res);
  return {
    items,
    total: meta.total,
    page: meta.page || page,
    limit: meta.limit || limit,
    offset: meta.offset,
  };
}

export async function fetchCustomers(config?: RequestConfig): Promise<CustomerItem[]> {
  const { items } = await fetchCustomersPage({ page: 1, limit: 500 }, config);
  return items;
}

export async function updateCustomerStatus(
  customerId: number | string,
  status: CustomerStatus,
  config?: RequestConfig
): Promise<CustomerItem | null> {
  const endpoint = customerRoute.updateStatus.replace("{customer}", encodeURIComponent(String(customerId)));
  const body = { status };
  try {
    const res = await apiClient.post<any>(endpoint, body, config);
    const obj = toObject(res);
    const user = toObject(obj?.user) ?? toObject(obj?.customer) ?? obj;
    return user ? mapCustomer(user, 0) : null;
  } catch {
    const res = await apiClient.put<any>(endpoint, body, config);
    const obj = toObject(res);
    const user = toObject(obj?.user) ?? toObject(obj?.customer) ?? obj;
    return user ? mapCustomer(user, 0) : null;
  }
}

