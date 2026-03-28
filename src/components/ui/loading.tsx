import type { FC } from "react";
import { cn } from "@/lib/utils";

export type LoadingProps = {
  /** Spinner diameter in px */
  size?: number;
  className?: string;
  /** Accessible name / screen-reader text when `message` is not shown */
  label?: string;
  /** Visible text next to the spinner (e.g. table loading row) */
  message?: string;
};

const Loading: FC<LoadingProps> = ({
  size = 16,
  className,
  label = "Loading",
  message,
}) => {
  const stroke = Math.max(2, Math.floor(size / 6));
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin shrink-0"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={stroke} opacity="0.15" />
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
      {message ? (
        <span className="text-sm font-body text-muted-foreground">{message}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
};

export default Loading;
