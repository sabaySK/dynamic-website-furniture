import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronDown, Download } from "lucide-react";
import { toast } from "sonner";

export interface ImageItem {
  url: string;
  media_id?: number;
  file_name?: string;
}

interface PreviewImageProps {
  // Controlled preview mode (fullscreen viewer)
  open?: boolean;
  images?: ImageItem[];
  initialIndex?: number;
  title?: string;
  onClose?: () => void;

  // Backward-compatible thumbnail mode
  src?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
}

const PreviewImage: React.FC<PreviewImageProps> = ({
  open,
  images,
  initialIndex = 0,
  title,
  onClose,
  src,
  alt = "Preview image",
  className = "h-24 w-full rounded border border-border overflow-hidden bg-muted",
  imageClassName = "h-full w-full object-cover",
}) => {
  const isControlled = typeof open === "boolean" && typeof onClose === "function";
  const [internalOpen, setInternalOpen] = useState(false);
  const [current, setCurrent] = useState(initialIndex);

  const effectiveOpen = isControlled ? Boolean(open) : internalOpen;
  const effectiveImages = useMemo<ImageItem[]>(() => {
    if (images && images.length > 0) return images;
    if (src) return [{ url: src }];
    return [];
  }, [images, src]);

  const close = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  useEffect(() => {
    if (effectiveOpen) setCurrent(initialIndex ?? 0);
  }, [effectiveOpen, initialIndex]);

  useEffect(() => {
    if (!effectiveOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") {
        setCurrent((c) => (c <= 0 ? effectiveImages.length - 1 : c - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrent((c) => (c >= effectiveImages.length - 1 ? 0 : c + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [effectiveOpen, effectiveImages.length]);

  const navigate = (dir: "prev" | "next") => {
    setCurrent((c) => {
      if (dir === "prev") return c <= 0 ? effectiveImages.length - 1 : c - 1;
      return c >= effectiveImages.length - 1 ? 0 : c + 1;
    });
  };

  const download = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const img = effectiveImages[current];
    const url = img?.url;
    if (!url) {
      toast.error("No image to download");
      return;
    }
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const filename = img.file_name || url.split("/").pop() || `image-${current + 1}.jpg`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
      toast.success("Downloaded image");
    } catch {
      window.open(url, "_blank");
      toast.error("Could not download directly - opened image in new tab");
    }
  };

  return (
    <>
      {src ? (
        <button
          type="button"
          onClick={() => setInternalOpen(true)}
          className={`${className} block transition-opacity hover:opacity-90`}
          title="Preview image"
        >
          <img src={src} alt={alt} className={imageClassName} />
        </button>
      ) : null}

      {effectiveOpen && effectiveImages.length > 0
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
              onClick={close}
              onMouseDown={(e) => {
                // Prevent pointer-down from reaching underlying dialogs
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/10 z-[201]"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                aria-label="Close image preview"
              >
                <X className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-16 text-white hover:bg-white/10 z-[201]"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  void download(e);
                }}
                aria-label="Download image"
              >
                <Download className="h-5 w-5" />
              </Button>

              {effectiveImages.length > 1 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-[201] h-12 w-12"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("prev");
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              ) : null}

              <div
                className="w-full h-full flex flex-col items-center justify-center px-4"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={effectiveImages[current].url}
                  alt={title || alt}
                  className="max-h-[90vh] max-w-[94vw] w-auto h-auto object-contain rounded-lg"
                />
                <div className="mt-4 text-center space-y-2">
                  {title ? <h3 className="font-serif text-2xl text-white">{title}</h3> : null}
                  {effectiveImages.length > 1 ? (
                    <span className="text-white/80 text-lg">
                      {current + 1} / {effectiveImages.length}
                    </span>
                  ) : null}
                </div>
              </div>

              {effectiveImages.length > 1 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-[201] h-12 w-12"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("next");
                  }}
                  aria-label="Next image"
                >
                  <ChevronDown className="h-8 w-8 -rotate-90" />
                </Button>
              ) : null}
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default PreviewImage;
