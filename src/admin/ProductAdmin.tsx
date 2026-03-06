import { useEffect, useMemo, useState } from "react";
import { getProducts, saveProducts, getCategories } from "@/lib/catalog";
import type { Product, Category, Material, Color } from "@/data/products";
import { materials, colors } from "@/data/products";
import { toast } from "sonner";

const empty: Omit<Product, "id" | "image" | "rating"> & { image?: string; rating?: number } = {
  name: "",
  price: 0,
  originalPrice: undefined,
  category: "Living Room",
  gallery: [],
  description: "",
  longDescription: "",
  specs: {} as Record<string, string>,
  featured: false,
  isNew: false,
  reviews: 0,
  material: [],
  color: undefined,
  colorOptions: undefined as Color[] | undefined,
  inStock: true,
  videoUrl: undefined as string | undefined,
};

const ProductAdmin = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [galleryUrl, setGalleryUrl] = useState("");

  useEffect(() => {
    setItems(getProducts());
  }, []);

  const categories = useMemo(() => getCategories(), []);

  const updateSpec = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      specs: {
        ...(prev.specs ?? {}),
        [key]: value,
      },
    }));
  };

  const setMainImageFromFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const addGalleryImagesFromFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    Promise.all(
      list.map(
        (f) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
            reader.readAsDataURL(f);
          }),
      ),
    ).then((urls) => {
      setForm((prev) => ({
        ...prev,
        gallery: [...(prev.gallery ?? []), ...urls.filter((u) => u.trim().length > 0)],
      }));
    });
  };

  const addGalleryImageFromUrl = () => {
    const url = galleryUrl.trim();
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      gallery: [...(prev.gallery ?? []), url],
    }));
    setGalleryUrl("");
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: (prev.gallery ?? []).filter((_, i) => i !== index),
    }));
  };

  const startAdd = () => {
    setEditing(null);
    setForm({
      ...empty,
      category: categories[0] ?? "Living Room",
      specs: {
        Dimensions: "",
        "Seat Height": "",
        Weight: "",
        Frame: "",
        Cushion: "",
        "Max Load": "",
      },
    });
    setGalleryUrl("");
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      category: p.category as Category,
      gallery: p.gallery ?? [],
      description: p.description,
      longDescription: p.longDescription ?? "",
      specs: {
        Dimensions: p.specs?.Dimensions ?? "",
        "Seat Height": p.specs?.["Seat Height"] ?? "",
        Weight: p.specs?.Weight ?? "",
        Frame: p.specs?.Frame ?? "",
        Cushion: p.specs?.Cushion ?? "",
        "Max Load": p.specs?.["Max Load"] ?? "",
        ...(p.specs ?? {}),
      },
      featured: !!p.featured,
      isNew: !!p.isNew,
      reviews: p.reviews ?? 0,
      image: p.image,
      rating: p.rating,
      material: p.material ?? [],
      color: p.color,
      colorOptions: p.colorOptions,
      inStock: p.inStock ?? true,
      videoUrl: p.videoUrl,
    });
    setGalleryUrl("");
  };

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    saveProducts(next);
    setItems(next);
    toast.success("Product removed");
  };

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.price || form.price < 0) {
      toast.error("Price must be positive");
      return;
    }
    const payload: Product = {
      id: editing?.id ?? String(Date.now()),
      name: form.name,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category as Category,
      image: form.image || "",
      gallery: form.gallery && form.gallery.length ? form.gallery : undefined,
      description: form.description,
      longDescription: form.longDescription || undefined,
      specs:
        form.specs && Object.keys(form.specs).some((k) => String(form.specs?.[k] ?? "").trim().length > 0)
          ? Object.fromEntries(
              Object.entries(form.specs).filter(([, v]) => String(v ?? "").trim().length > 0),
            )
          : undefined,
      featured: !!form.featured,
      isNew: !!form.isNew,
      rating: form.rating ?? 4.5,
      reviews: form.reviews ?? 0,
      material: form.material?.length ? form.material : undefined,
      color: form.color,
      colorOptions: form.colorOptions?.length ? form.colorOptions : undefined,
      inStock: form.inStock ?? true,
      videoUrl: form.videoUrl || undefined,
    };
    const exists = items.some((i) => i.id === payload.id);
    const next = exists ? items.map((i) => (i.id === payload.id ? payload : i)) : [payload, ...items];
    saveProducts(next);
    setItems(next);
    setEditing(null);
    setForm(empty);
    setGalleryUrl("");
    toast.success(exists ? "Product updated" : "Product added");
  };

  return (
    <div className="w-full max-w-none space-y-12">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full border border-border rounded-lg bg-card">
          <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead className="bg-card">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Featured</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4 truncate max-w-xs">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">${p.price.toFixed(2)}</td>
                  <td className="p-4">{p.featured ? "Yes" : "No"}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="px-3 py-1 rounded border border-border hover:bg-muted/50 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => remove(p.id)} className="px-3 py-1 rounded border border-destructive text-destructive hover:bg-destructive/10 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="w-full border border-border rounded-lg bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">{editing ? "Edit Product" : "Create Product"}</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="bg-card border border-border rounded-lg px-4 py-3 text-sm"
            />
            <input
              placeholder="Original Price"
              type="number"
              value={form.originalPrice ?? ""}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="bg-card border border-border rounded-lg px-4 py-3 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="bg-card border border-border rounded-lg px-4 py-3 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="space-y-2">
              <input
                placeholder="Image URL"
                value={form.image ?? ""}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
              />
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMainImageFromFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm"
                />
                {form.image ? (
                  <img src={form.image} alt="Main" className="h-10 w-10 rounded border border-border object-cover" />
                ) : null}
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-display font-semibold">More pictures</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => addGalleryImagesFromFiles(e.target.files)}
                className="block text-sm"
              />
            </div>

            <div className="flex gap-2">
              <input
                placeholder="Add image URL"
                value={galleryUrl}
                onChange={(e) => setGalleryUrl(e.target.value)}
                className="flex-1 bg-card border border-border rounded-lg px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addGalleryImageFromUrl}
                className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
              >
                Add
              </button>
            </div>

            {(form.gallery ?? []).length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {(form.gallery ?? []).map((src, idx) => (
                  <div key={`${src}-${idx}`} className="relative">
                    <img src={src} alt={`Gallery ${idx + 1}`} className="h-16 w-full rounded border border-border object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-background/90 border border-border rounded px-2 py-0.5 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <textarea
            placeholder="Short Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
          />
          <textarea
            placeholder="Long Description"
            rows={4}
            value={form.longDescription ?? ""}
            onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
          />

          <div className="border border-border rounded-lg p-4">
            <p className="text-sm font-display font-semibold mb-3">Specifications</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Dimensions"
                value={form.specs?.Dimensions ?? ""}
                onChange={(e) => updateSpec("Dimensions", e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-3 text-sm"
              />
              <input
                placeholder="Seat Height"
                value={form.specs?.["Seat Height"] ?? ""}
                onChange={(e) => updateSpec("Seat Height", e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-3 text-sm"
              />
              <input
                placeholder="Weight"
                value={form.specs?.Weight ?? ""}
                onChange={(e) => updateSpec("Weight", e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-3 text-sm"
              />
              <input
                placeholder="Frame"
                value={form.specs?.Frame ?? ""}
                onChange={(e) => updateSpec("Frame", e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-3 text-sm"
              />
              <input
                placeholder="Cushion"
                value={form.specs?.Cushion ?? ""}
                onChange={(e) => updateSpec("Cushion", e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-3 text-sm"
              />
              <input
                placeholder="Max Load"
                value={form.specs?.["Max Load"] ?? ""}
                onChange={(e) => updateSpec("Max Load", e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-3 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} />
              New
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.inStock !== false}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              />
              In Stock
            </label>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-display font-semibold">Material</p>
            <div className="flex flex-wrap gap-2">
              {materials.map((m) => (
                <label key={m} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={(form.material ?? []).includes(m)}
                    onChange={(e) => {
                      const current = form.material ?? [];
                      const next = e.target.checked
                        ? [...current, m]
                        : current.filter((x) => x !== m);
                      setForm({ ...form, material: next });
                    }}
                  />
                  {m}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-display font-semibold">Color</p>
            <select
              value={form.color ?? ""}
              onChange={(e) => setForm({ ...form, color: (e.target.value || undefined) as Color | undefined })}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
            >
              <option value="">Any</option>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-display font-semibold">Color Options (for product detail)</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <label key={c} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={(form.colorOptions ?? []).includes(c)}
                    onChange={(e) => {
                      const current = form.colorOptions ?? [];
                      const next = e.target.checked
                        ? [...current, c]
                        : current.filter((x) => x !== c);
                      setForm({ ...form, colorOptions: next.length > 0 ? next : undefined });
                    }}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-display font-semibold">Video URL (optional)</p>
            <input
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              value={form.videoUrl ?? ""}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value || undefined })}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={save} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-body">
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductAdmin;
