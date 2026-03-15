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

type WhyChooseItem = {
  icon: string;
  content: string;
};

const defaultItems: WhyChooseItem[] = [
  {
    icon: "",
    content: "Handcrafted by skilled artisans using traditional techniques",
  },
  {
    icon: "",
    content: "FSC-certified wood and eco-friendly materials only",
  },
  {
    icon: "",
    content: "10-year warranty on all solid wood furniture",
  },
  {
    icon: "",
    content: "Carbon-neutral shipping worldwide",
  },
  {
    icon: "",
    content: "Direct from workshop—no middlemen, fair prices",
  },
  {
    icon: "",
    content: "Free design consultation for large orders",
  },
];

function safeParseWhyChoose(raw: string): WhyChooseItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized: WhyChooseItem[] = parsed.map((t: any) => {
      return {
        icon: typeof t?.icon === "string" ? t.icon : "",
        content: typeof t?.content === "string" ? t.content : (typeof t?.text === "string" ? t.text : ""),
      };
    });
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

const WhyChooseAdmin = () => {
  const [items, setItems] = useState<WhyChooseItem[]>(defaultItems);
  const [saving, setSaving] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [newItem, setNewItem] = useState<WhyChooseItem>({
    icon: "",
    content: "",
  });

  const [editingItem, setEditingItem] = useState<WhyChooseItem | null>(null);
  const [viewingItem, setViewingItem] = useState<WhyChooseItem | null>(null);

  useEffect(() => {
    const overrideItemsRaw = getOverride("about.whyChoose.items", "");
    const parsed = overrideItemsRaw ? safeParseWhyChoose(overrideItemsRaw) : null;
    setItems(parsed ?? defaultItems);
  }, []);

  const handleSetNewIconFromFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setNewItem((prev) => ({ ...prev, icon: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSetEditIconFromFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (editingItem) {
        setEditingItem({ ...editingItem, icon: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = () => {
    if (!newItem.content.trim()) {
      toast.error("Please fill in the content.");
      return;
    }
    setItems((prev) => [...prev, newItem]);
    setNewItem({
      icon: "",
      content: "",
    });
    setIsAddOpen(false);
  };

  const openEdit = (index: number) => {
    setSelectedIdx(index);
    setEditingItem({ ...items[index] });
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (selectedIdx === null || !editingItem) return;
    if (!editingItem.content.trim()) {
      toast.error("Please fill in the content.");
      return;
    }
    setItems((prev) => prev.map((it, i) => (i === selectedIdx ? editingItem : it)));
    setIsEditOpen(false);
  };

  const openView = (index: number) => {
    setViewingItem(items[index]);
    setIsViewOpen(true);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    setSaving(true);
    setOverrides({
      "about.whyChoose.items": JSON.stringify(items),
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Why Choose Us items updated");
    }, 600);
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-semibold">Why Choose Us</h3>
                <p className="text-xs text-muted-foreground font-body">Manage the advantages section.</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Item
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Item</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Icon</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSetNewIconFromFile(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                          />
                          {newItem.icon ? (
                            <img src={newItem.icon} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                          ) : null}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Content*</label>
                        <textarea
                          required
                          value={newItem.content}
                          onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          placeholder="Why choose this?"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <button
                        onClick={() => setIsAddOpen(false)}
                        className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSubmit}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors"
                      >
                        Save Item
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
                    <TableHead className="w-[10%]">Icon</TableHead>
                    <TableHead className="w-[75%]">Content</TableHead>
                    <TableHead className="w-[15%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="p-2 align-middle text-center">
                        {it.icon ? (
                          <img src={it.icon} className="h-8 w-8 object-contain mx-auto" />
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body line-clamp-2 block w-full">
                          {it.content}
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
                    <DialogTitle>Edit Item</DialogTitle>
                  </DialogHeader>
                  {editingItem && (
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Icon</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSetEditIconFromFile(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                          />
                          {editingItem.icon ? (
                            <img src={editingItem.icon} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                          ) : null}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Content*</label>
                        <textarea
                          required
                          value={editingItem.content}
                          onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleEditSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors">
                      Save
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* View Dialog */}
              <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>View Item</DialogTitle>
                  </DialogHeader>
                  {viewingItem && (
                    <div className="grid gap-4 py-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Icon</p>
                        {viewingItem.icon ? (
                          <div className="mt-1 rounded-lg overflow-hidden border border-border w-16 h-16 flex items-center justify-center p-2">
                            <img src={viewingItem.icon} className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <p className="font-body text-sm">—</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Content</p>
                        <p className="font-body text-sm whitespace-pre-wrap">{viewingItem.content}</p>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <button onClick={() => setIsViewOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors">
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

export default WhyChooseAdmin;
