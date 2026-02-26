export type OverrideMap = Record<string, string>;

const STORAGE_KEY = "site_overrides";

function readOverrides(): OverrideMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as OverrideMap;
  } catch {
    return {};
  }
}

function writeOverrides(next: OverrideMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* noop */
  }
}

export function getOverride(key: string, fallback: string): string {
  const map = readOverrides();
  const val = map[key];
  return typeof val === "string" && val.length > 0 ? val : fallback;
}

export function setOverride(key: string, value: string) {
  const map = readOverrides();
  map[key] = value;
  writeOverrides(map);
}

export function setOverrides(partial: OverrideMap) {
  const map = readOverrides();
  Object.assign(map, partial);
  writeOverrides(map);
}

export function getOverrides(): OverrideMap {
  return readOverrides();
}
