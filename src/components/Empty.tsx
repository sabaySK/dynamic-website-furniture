import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmptyProps = {
  title?: string;
  description?: string;
  /** Override default inbox icon */
  icon?: ReactNode;
  className?: string;
};

/**
 * Empty state for lists and tables (no data yet).
 */
export default function Empty({ title = "No data", description, icon, className }: EmptyProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-8 px-4 text-center",
        className
      )}
    >
      <div className="rounded-full bg-muted p-2.5 text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </div>
      <p className="text-sm font-medium font-body text-foreground">{title}</p>
      {description ? (
        <p className="text-xs text-muted-foreground font-body max-w-sm">{description}</p>
      ) : null}
    </div>
  );
}
