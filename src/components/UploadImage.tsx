import { useRef, useCallback } from "react";
import { ImagePlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULT_MAX_BYTES = 50 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg";

export type UploadImageProps = {
  /** Label above the drop zone (e.g. "Profile Photo") */
  label?: string;
  /** Shown when no new file is selected (existing avatar URL). */
  previewUrl?: string | null;
  /** Called with a valid file after type/size checks. */
  onFileSelect: (file: File) => void;
  /** Called when user removes the current image. */
  onRemove?: () => void;
  maxBytes?: number;
  disabled?: boolean;
  className?: string;
};

export default function UploadImage({
  label = "Profile Photo",
  onFileSelect,
  onRemove,
  previewUrl,
  maxBytes = DEFAULT_MAX_BYTES,
  disabled,
  className,
}: UploadImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndEmit = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const okType = file.type === "image/png" || file.type === "image/jpeg";
      if (!okType) {
        toast.error("Please use a PNG or JPG image");
        return;
      }
      if (file.size > maxBytes) {
        toast.error(`Image must be ${Math.round(maxBytes / (1024 * 1024))} MB or smaller`);
        return;
      }
      onFileSelect(file);
    },
    [maxBytes, onFileSelect]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    validateAndEmit(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    validateAndEmit(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const hasPreview = Boolean(previewUrl);

  return (
    <div className={cn("space-y-2 w-full", className)}>
      <Label className="text-muted-foreground font-body">{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={onInputChange}
        disabled={disabled}
        aria-label={label}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={cn(
          "relative flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 transition-colors",
          "border-[#c9a88a]/70 bg-muted/40 hover:bg-muted/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {hasPreview ? (
          <div className="flex w-full flex-col items-center gap-4">
            <div className="relative max-h-48 w-full max-w-xs overflow-hidden rounded-lg border border-border bg-background">
              {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
              <img src={previewUrl!} alt="" className="mx-auto max-h-48 w-full object-contain" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
              >
                Change image
              </Button>
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 text-slate-500">
              <ImagePlus className="mx-auto h-12 w-12 stroke-[1.25]" aria-hidden />
            </div>
            <p className="font-body text-sm font-medium text-slate-600">Click to upload image</p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              PNG, JPG up to {Math.round(maxBytes / (1024 * 1024))}MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}
