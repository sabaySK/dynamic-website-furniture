const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Format a date/time into: "dd mmmm yyyy hh mm AM/PM"
 *
 * Examples:
 *  formatDateTime(new Date("2026-04-16T13:05:00")) -> "16 April 2026 01 05 PM"
 *
 * Accepts Date, timestamp (number) or date string.
 */
export function formatDateTime(input: Date | string | number): string {
  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {
    let s = input.trim();
    // Handle "YYYY-MM-DD HH:MM:SS" by converting to "YYYY-MM-DDTHH:MM:SS"
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(s)) {
      s = s.replace(" ", "T");
    }
    date = new Date(s);
    // Fallback: try treating as UTC if still invalid
    if (Number.isNaN(date.getTime())) {
      date = new Date(s + "Z");
    }
  } else {
    date = new Date(input);
  }

  if (Number.isNaN(date.getTime())) return "";

  const dd = String(date.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[date.getMonth()];
  const yyyy = date.getFullYear();

  let hh = date.getHours();
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  hh = hh % 12;
  if (hh === 0) hh = 12;
  const hhStr = String(hh).padStart(2, "0");

  return `${dd} ${month} ${yyyy} ${hhStr} ${mm} ${ampm}`;
}

export default formatDateTime;

/**
 * Format a date into: "dd mmmm yyyy"
 *
 * Accepts Date, timestamp (number) or date string.
 */
export function formatDate(input: Date | string | number): string {
  let date: Date;
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {
    let s = input.trim();
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(s)) {
      s = s.replace(" ", "T");
    }
    date = new Date(s);
    if (Number.isNaN(date.getTime())) {
      date = new Date(s + "Z");
    }
  } else {
    date = new Date(input);
  }
  if (Number.isNaN(date.getTime())) return "";

  const dd = String(date.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[date.getMonth()];
  const yyyy = date.getFullYear();
  return `${dd} ${month} ${yyyy}`;
}

