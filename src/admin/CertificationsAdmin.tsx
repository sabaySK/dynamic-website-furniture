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

type CertificationItem = {
  icon: string;
  title: string;
  description: string;
};

const defaultItems: CertificationItem[] = [
  { name: "FSC Certified", desc: "Responsibly sourced wood" },
  { name: "B Corp Pending", desc: "Social & environmental impact" },
  { name: "Carbon Neutral", desc: "Net-zero shipping since 2024" },
  { name: "OEKO-TEX®", desc: "Tested for harmful substances" },
].map(c => ({ icon: "", title: c.name, description: c.desc }));

function safeParseCertifications(raw: string): CertificationItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized: CertificationItem[] = parsed.map((t: any) => {
      return {
        icon: typeof t?.icon === "string" ? t.icon : "",
        title: typeof t?.title === "string" ? t.title : (typeof t?.name === "string" ? t.name : ""),
        description: typeof t?.description === "string" ? t.description : (typeof t?.desc === "string" ? t.desc : ""),
      };
    });
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

const CertificationsAdmin = () => {
  const [items, setItems] = useState<CertificationItem[]>(defaultItems);
  const [saving, setSaving] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [newItem, setNewItem] = useState<CertificationItem>({
    icon: "",
    title: "",
    description: "",
  });

  const [editingItem, setEditingItem] = useState<CertificationItem | null>(null);
  const [viewingItem, setViewingItem] = useState<CertificationItem | null>(null);

  useEffect(() => {
    const overrideItemsRaw = getOverride("about.certifications.items", "");
    const parsed = overrideItemsRaw ? safeParseCertifications(overrideItemsRaw) : null;
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
    if (!newItem.title.trim() || !newItem.description.trim()) {
      toast.error("Please fill in the title and description.");
      return;
    }
    setItems((prev) => [...prev, newItem]);
    setNewItem({
      icon: "",
      title: "",
      description: "",
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
    if (!editingItem.title.trim() || !editingItem.description.trim()) {
      toast.error("Please fill in the title and description.");
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
      "about.certifications.items": JSON.stringify(items),
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Certifications updated");
    }, 600);
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-semibold">Certifications</h3>
                <p className="text-xs text-muted-foreground font-body">Manage certificates and standards.</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Certification
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Certification</DialogTitle>
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
                        <label className="text-xs font-body font-medium">Title*</label>
                        <input
                          required
                          value={newItem.title}
                          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="FSC Certified"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Description*</label>
                        <textarea
                          required
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          placeholder="Responsibilities..."
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
                        Save Certification
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
                    <TableHead className="w-[20%]">Title</TableHead>
                    <TableHead className="w-[55%]">Description</TableHead>
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
                        <span className="px-2 py-1.5 text-sm font-body font-semibold truncate block w-full">
                          {it.title}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body line-clamp-2 block w-full">
                          {it.description}
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
                    <DialogTitle>Edit Certification</DialogTitle>
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
                        <label className="text-xs font-body font-medium">Title*</label>
                        <input
                          required
                          value={editingItem.title}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
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
                    <DialogTitle>View Certification</DialogTitle>
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
                        <p className="text-xs text-muted-foreground font-body">Title</p>
                        <p className="font-body text-sm font-semibold">{viewingItem.title}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Description</p>
                        <p className="font-body text-sm whitespace-pre-wrap">{viewingItem.description}</p>
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

export default CertificationsAdmin;
