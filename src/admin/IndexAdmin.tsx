import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import TestimonialsSection from "@/components/home/TestimonialsSection";

type TestimonialItem = {
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
};

const defaultTestimonials: TestimonialItem[] = [
  {
    name: "Anna K.",
    location: "Stockholm, Sweden",
    rating: 5,
    text: "The Nordic Linen Sofa transformed our living room. The craftsmanship is incredible — you can feel the quality the moment you sit down.",
    product: "Nordic Linen Sofa",
  },
  {
    name: "Marcus T.",
    location: "Copenhagen, Denmark",
    rating: 5,
    text: "We ordered the Artisan Dining Table and it's even more beautiful in person. Our family gathers around it every evening now.",
    product: "Artisan Dining Table",
  },
  {
    name: "Sophie L.",
    location: "Oslo, Norway",
    rating: 5,
    text: "Exceptional quality and the design consultation was so helpful. The team helped us furnish our entire apartment in one cohesive style.",
    product: "Full Home Package",
  },
];

function safeParseTestimonials(raw: string): TestimonialItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized: TestimonialItem[] = parsed.map((t: any) => {
      const rating = Number(t?.rating);
      return {
        name: typeof t?.name === "string" ? t.name : "",
        location: typeof t?.location === "string" ? t.location : "",
        rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : 5,
        text: typeof t?.text === "string" ? t.text : "",
        product: typeof t?.product === "string" ? t.product : "",
      };
    });
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

const IndexAdmin = () => {
  const [items, setItems] = useState<TestimonialItem[]>(defaultTestimonials);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const overrideItemsRaw = getOverride("index.testimonials.items", "");
    const parsed = overrideItemsRaw ? safeParseTestimonials(overrideItemsRaw) : null;
    setItems(parsed ?? defaultTestimonials);
  }, []);

  const addBox = () => {
    setItems((prev) => [
      ...prev,
      {
        name: "",
        location: "",
        rating: 5,
        text: "",
        product: "",
      },
    ]);
  };

  const updateItem = (index: number, patch: Partial<TestimonialItem>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    setSaving(true);
    setOverrides({
      "index.testimonials.items": JSON.stringify(items),
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Customer Stories updated");
    }, 600);
  };

  const cancel = () => {
    const overrideItemsRaw = getOverride("index.testimonials.items", "");
    const parsed = overrideItemsRaw ? safeParseTestimonials(overrideItemsRaw) : null;
    setItems(parsed ?? defaultTestimonials);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-semibold">Boxes</h3>
                <p className="text-xs text-muted-foreground font-body">Add / edit the testimonial description boxes.</p>
              </div>
              <button
                type="button"
                onClick={addBox}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Box
              </button>
            </div>

            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={idx} className="border border-border rounded-lg p-3 bg-background/40">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-sm font-body font-medium">Box {idx + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                      disabled={items.length <= 1}
                      title={items.length <= 1 ? "At least one box is required" : "Remove"}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-xs font-body font-medium">Name</label>
                      <input
                        value={it.name}
                        onChange={(e) => updateItem(idx, { name: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-body font-medium">Location</label>
                      <input
                        value={it.location}
                        onChange={(e) => updateItem(idx, { location: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-body font-medium">Product</label>
                      <input
                        value={it.product}
                        onChange={(e) => updateItem(idx, { product: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-body font-medium">Rating (1-5)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={it.rating}
                        onChange={(e) => updateItem(idx, { rating: Number(e.target.value) })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-xs font-body font-medium">Description</label>
                      <textarea
                        rows={3}
                        value={it.text}
                        onChange={(e) => updateItem(idx, { text: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={cancel}
              className="px-5 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={() => window.open("/", "_blank")}
              className="px-5 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
            >
              Preview Site
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-body hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-base font-display font-semibold">Preview</h2>
          <p className="text-sm text-muted-foreground font-body">Live preview of the Customer Stories section header.</p>
        </div>
        <div className="bg-background">
          <TestimonialsSection />
        </div>
      </div>
    </div>
  );
};

export default IndexAdmin;
