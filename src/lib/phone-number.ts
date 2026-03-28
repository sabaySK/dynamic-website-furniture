/**
 * Phone number formatting utilities.
 *
 * Rules:
 * - 9 digits  -> "000 000 000"
 * - 10 digits -> "000 000 0000"
 *
 * Falls back to returning the original input string when it can't be parsed.
 */
export function formatPhoneNumber(input: string | number): string {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (!digits) return raw;

  if (digits.length === 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  }

  // Best-effort fallback:
  if (digits.length <= 6) {
    return digits.replace(/(\d{3})(\d{1,3})?/, (_m, a, b) => (b ? `${a} ${b}` : a)).trim();
  }

  if (digits.length <= 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{1,4})?/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  }

  // For longer strings, return with country prefix if present
  return (hasPlus ? "+" : "") + digits;
}

/** Return a tel: href-friendly string (keeps + if present). */
export function toTelHref(input: string | number): string {
  const raw = String(input ?? "").trim();
  if (!raw) return "";
  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (!digits) return raw;
  return (hasPlus ? "+" : "") + digits;
}

export default formatPhoneNumber;

