import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

type BrandItem = {
  logo: string;
  name: string;
  description: string;
  status: "active" | "inactive";
};

const defaultItems: BrandItem[] = [
  {
    logo: "",
    name: "LV",
    description: "LV Brand",
    status: "active",
  }
];

function safeParseBrands(raw: string): BrandItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized: BrandItem[] = parsed.map((t: any) => {
      return {
        logo: typeof t?.logo === "string" ? t.logo : "",
        name: typeof t?.name === "string" ? t.name : "",
        description: typeof t?.description === "string" ? t.description : "",
        status: t?.status === "inactive" ? "inactive" : "active",
      };
    });
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

const BrandsAdmin = () => {
  const [items, setItems] = useState<BrandItem[]>(defaultItems);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [newItem, setNewItem] = useState<BrandItem>({
    logo: "",
    name: "",
    description: "",
    status: "active",
  });

  const [editingItem, setEditingItem] = useState<BrandItem | null>(null);
  const [viewingItem, setViewingItem] = useState<BrandItem | null>(null);

  useEffect(() => {
    const overrideItemsRaw = getOverride("brands.data.items", "");
    const parsed = overrideItemsRaw ? safeParseBrands(overrideItemsRaw) : null;
    setItems(parsed ?? defaultItems);
  }, []);

  const saveItems = (newItems: BrandItem[]) => {
    setOverrides({
      "brands.data.items": JSON.stringify(newItems),
    });
  };

  const handleSetNewLogoFromFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setNewItem((prev) => ({ ...prev, logo: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSetEditLogoFromFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (editingItem) {
        setEditingItem({ ...editingItem, logo: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = () => {
    if (!newItem.name.trim() || !newItem.description.trim()) {
      toast.error("Please fill in the name and description.");
      return;
    }
    const nextItems = [...items, newItem];
    setItems(nextItems);
    saveItems(nextItems);
    setNewItem({
      logo: "",
      name: "",
      description: "",
      status: "active",
    });
    setIsAddOpen(false);
    toast.success("Brand added");
  };

  const openEdit = (index: number) => {
    setSelectedIdx(index);
    setEditingItem({ ...items[index] });
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (selectedIdx === null || !editingItem) return;
    if (!editingItem.name.trim() || !editingItem.description.trim()) {
      toast.error("Please fill in the name and description.");
      return;
    }
    const nextItems = items.map((it, i) => (i === selectedIdx ? editingItem : it));
    setItems(nextItems);
    saveItems(nextItems);
    setIsEditOpen(false);
    toast.success("Brand updated");
  };

  const openView = (index: number) => {
    setViewingItem(items[index]);
    setIsViewOpen(true);
  };

  const removeItem = (index: number) => {
    const nextItems = items.filter((_, i) => i !== index);
    setItems(nextItems);
    saveItems(nextItems);
    toast.success("Brand removed");
  };

  return (
    <div className="w-full font-body">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-semibold">Brands</h3>
                <p className="text-xs text-muted-foreground font-body">Manage the partner brands section.</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Brand
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Brand</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Logo</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSetNewLogoFromFile(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                          />
                          {newItem.logo ? (
                            <img src={newItem.logo} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                          ) : null}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Name*</label>
                        <input
                          required
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="Brand Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Description*</label>
                        <textarea
                          required
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          placeholder="Describe this brand..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Status</label>
                        <select
                          value={newItem.status}
                          onChange={(e) => setNewItem({ ...newItem, status: e.target.value as "active" | "inactive" })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <button
                        type="button"
                        onClick={() => setIsAddOpen(false)}
                        className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSubmit}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors"
                      >
                        Save
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table className="table-fixed min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%]">Logo</TableHead>
                    <TableHead className="w-[20%]">Name</TableHead>
                    <TableHead className="w-[40%]">Description</TableHead>
                    <TableHead className="w-[15%]">Status</TableHead>
                    <TableHead className="w-[15%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="p-2 align-middle text-center">
                        {it.logo ? (
                          <img src={it.logo} className="h-8 w-8 object-contain mx-auto" />
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body font-semibold truncate block w-full">
                          {it.name}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body line-clamp-2 block w-full">
                          {it.description}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full inline-block ${it.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                          {it.status}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openView(idx)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(idx)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Edit Dialog */}
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Brand</DialogTitle>
                  </DialogHeader>
                  {editingItem && (
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Logo</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSetEditLogoFromFile(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                          />
                          {editingItem.logo ? (
                            <img src={editingItem.logo} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                          ) : null}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Name*</label>
                        <input
                          required
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Description*</label>
                        <textarea
                          required
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Status</label>
                        <select
                          value={editingItem.status}
                          onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as "active" | "inactive" })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <button
                      type="button"
                      onClick={() => setIsEditOpen(false)}
                      className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleEditSubmit}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors"
                    >
                      Save
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* View Dialog */}
              <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>View Brand</DialogTitle>
                  </DialogHeader>
                  {viewingItem && (
                    <div className="grid gap-4 py-4 font-body">
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Logo</p>
                        {viewingItem.logo ? (
                          <div className="mt-1 rounded-lg overflow-hidden border border-border w-16 h-16 flex items-center justify-center p-2">
                            <img src={viewingItem.logo} className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <p className="font-body text-sm">—</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Name</p>
                        <p className="font-body text-sm font-semibold">{viewingItem.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Description</p>
                        <p className="font-body text-sm whitespace-pre-wrap">{viewingItem.description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Status</p>
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full inline-block ${viewingItem.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                          {viewingItem.status}
                        </span>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <button
                      type="button"
                      onClick={() => setIsViewOpen(false)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors"
                    >
                      Close
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsAdmin;
