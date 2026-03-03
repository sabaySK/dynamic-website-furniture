import { useEffect, useState } from "react";
import { getOverride, setOverride } from "@/lib/overrides";

type Banner = {
  id: string;
  name: string;
  page: string;
  image: string;
};

const STORAGE_KEY = "admin.banners";

const emptyBanner: Omit<Banner, "id"> = {
  name: "",
  page: "",
  image: "",
};

const BannerAdmin = () => {
  const [items, setItems] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<Omit<Banner, "id">>(emptyBanner);

  useEffect(() => {
    try {
      const raw = getOverride(STORAGE_KEY, "[]");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(
          parsed
            .filter((b) => b && typeof b.id === "string")
            .map((b) => ({
              id: String(b.id),
              name: String(b.name ?? ""),
              page: String(b.page ?? ""),
              image: String(b.image ?? ""),
            })),
        );
      }
    } catch {
      setItems([]);
    }
  }, []);

  const persist = (next: Banner[]) => {
    setItems(next);
    setOverride(STORAGE_KEY, JSON.stringify(next));
  };

  const startCreate = () => {
    setEditing(null);
    setForm(emptyBanner);
  };

  const startEdit = (banner: Banner) => {
    setEditing(banner);
    setForm({
      name: banner.name,
      page: banner.page,
      image: banner.image,
    });
  };

  const remove = (id: string) => {
    const next = items.filter((b) => b.id !== id);
    persist(next);
    if (editing && editing.id === id) {
      setEditing(null);
      setForm(emptyBanner);
    }
  };

  const save = () => {
    const name = form.name.trim();
    if (!name) return;

    const payload: Banner = {
      id: editing?.id ?? String(Date.now()),
      name,
      page: form.page.trim(),
      image: form.image.trim(),
    };

    const exists = items.some((b) => b.id === payload.id);
    const next = exists ? items.map((b) => (b.id === payload.id ? payload : b)) : [payload, ...items];
    persist(next);
    setEditing(payload);
  };

  return (
    <div className="w-full max-w-none space-y-12 p-4 md:p-6">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full border border-border rounded-lg bg-card">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-card">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Page</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr className="border-t border-border">
                    <td colSpan={3} className="p-4 text-muted-foreground">
                      No banners yet
                    </td>
                  </tr>
                ) : (
                  items.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {b.image ? (
                            <img
                              src={b.image}
                              alt={b.name}
                              className="h-10 w-10 rounded border border-border object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : null}
                          <span className="truncate max-w-xs">{b.name || "Untitled banner"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{b.page || "-"}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(b)}
                            className="px-3 py-1 rounded border border-border hover:bg-muted/50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(b.id)}
                            className="px-3 py-1 rounded border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full border border-border rounded-lg bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">{editing ? "Edit Banner" : "Create Banner"}</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
            />
            <input
              placeholder="Page / location"
              value={form.page}
              onChange={(e) => setForm((prev) => ({ ...prev, page: e.target.value }))}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
            />
            <div className="w-full space-y-2">
              <input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
              />
              <div className="w-full flex items-center gap-3">
                <button
                  type="button"
                  onClick={startCreate}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                >
                  Reset
                </button>
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-10 w-10 rounded border border-border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={save}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-body"
              >
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAdmin;
