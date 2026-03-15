import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
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

type CategoryItem = {
    name: string;
    slug: string;
    status: string;
    description: string;
};

const defaultCategories: CategoryItem[] = [
    {
        name: "Living Room",
        slug: "living-room",
        status: "Active",
        description: "Furniture for living room including sofas, tables, etc.",
    },
    {
        name: "Bedroom",
        slug: "bedroom",
        status: "Active",
        description: "Beds, nightstands, and bedroom storage.",
    },
    {
        name: "Dining",
        slug: "dining",
        status: "Active",
        description: "Dining tables, chairs, and cabinets.",
    },
];

function safeParseCategories(raw: string): CategoryItem[] | null {
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        const normalized: CategoryItem[] = parsed.map((c: any) => {
            return {
                name: typeof c?.name === "string" ? c.name : "",
                slug: typeof c?.slug === "string" ? c.slug : "",
                status: typeof c?.status === "string" ? c.status : "Active",
                description: typeof c?.description === "string" ? c.description : "",
            };
        });
        return normalized.length > 0 ? normalized : null;
    } catch {
        return null;
    }
}

const CategoryAdmin = () => {
    const [items, setItems] = useState<CategoryItem[]>(defaultCategories);
    const [saving, setSaving] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const [newCategory, setNewCategory] = useState<CategoryItem>({
        name: "",
        slug: "",
        status: "Active",
        description: "",
    });

    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const [viewingCategory, setViewingCategory] = useState<CategoryItem | null>(null);

    useEffect(() => {
        const overrideItemsRaw = getOverride("admin.categories.items", "");
        const parsed = overrideItemsRaw ? safeParseCategories(overrideItemsRaw) : null;
        setItems(parsed ?? defaultCategories);
    }, []);

    const handleAddSubmit = () => {
        if (!newCategory.name.trim() || !newCategory.slug.trim()) {
            toast.error("Please fill in Name and Slug.");
            return;
        }
        setItems((prev) => [...prev, newCategory]);
        setNewCategory({
            name: "",
            slug: "",
            status: "Active",
            description: "",
        });
        setIsAddOpen(false);
    };

    const openEdit = (index: number) => {
        setSelectedIdx(index);
        setEditingCategory({ ...items[index] });
        setIsEditOpen(true);
    };

    const handleEditSubmit = () => {
        if (selectedIdx === null || !editingCategory) return;
        if (!editingCategory.name.trim() || !editingCategory.slug.trim()) {
            toast.error("Please fill in Name and Slug.");
            return;
        }
        setItems((prev) => prev.map((it, i) => (i === selectedIdx ? editingCategory : it)));
        setIsEditOpen(false);
    };

    const openView = (index: number) => {
        setViewingCategory(items[index]);
        setIsViewOpen(true);
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const save = () => {
        setSaving(true);
        setOverrides({
            "admin.categories.items": JSON.stringify(items),
        });
        setTimeout(() => {
            setSaving(false);
            toast.success("Categories updated");
        }, 600);
    };

    return (
        <div className="w-full">
            <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
                <div className="p-4 space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-display font-semibold">Categories</h3>
                                <p className="text-xs text-muted-foreground font-body">Manage product categories.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Category
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create Category</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Name*</label>
                                                <input
                                                    required
                                                    value={newCategory.name}
                                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                    placeholder="Category Name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Slug*</label>
                                                <input
                                                    required
                                                    value={newCategory.slug}
                                                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                    placeholder="category-slug"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Status</label>
                                                <select
                                                    value={newCategory.status}
                                                    onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Description</label>
                                                <textarea
                                                    value={newCategory.description}
                                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                                                    placeholder="Category Description"
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
                                                Save Category
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
                                        <TableHead className="w-[20%]">Name</TableHead>
                                        <TableHead className="w-[20%]">Slug</TableHead>
                                        <TableHead className="w-[15%]">Status</TableHead>
                                        <TableHead className="w-[30%]">Description</TableHead>
                                        <TableHead className="w-[15%]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((it, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="p-2 align-middle">
                                                <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                                                    {it.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="p-2 align-middle">
                                                <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                                                    {it.slug}
                                                </span>
                                            </TableCell>
                                            <TableCell className="p-2 align-middle">
                                                <span className="px-2 py-1.5 flex items-center gap-2 text-sm font-body truncate w-full">
                                                    <span className={`w-2 h-2 rounded-full ${it.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                    {it.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="p-2 align-middle">
                                                <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
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
                                                        disabled={items.length <= 1}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                                                        title={items.length <= 1 ? "At least one category is required" : "Remove"}
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
                                        <DialogTitle>Edit Category</DialogTitle>
                                    </DialogHeader>
                                    {editingCategory && (
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Name*</label>
                                                <input
                                                    required
                                                    value={editingCategory.name}
                                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Slug*</label>
                                                <input
                                                    required
                                                    value={editingCategory.slug}
                                                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Status</label>
                                                <select
                                                    value={editingCategory.status}
                                                    onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Description</label>
                                                <textarea
                                                    value={editingCategory.description}
                                                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
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
                                            Save Changes
                                        </button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* View Dialog */}
                            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>View Category</DialogTitle>
                                    </DialogHeader>
                                    {viewingCategory && (
                                        <div className="grid gap-4 py-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Name</p>
                                                <p className="font-body text-sm font-medium">{viewingCategory.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Slug</p>
                                                <p className="font-body text-sm">{viewingCategory.slug || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Status</p>
                                                <p className="font-body text-sm">
                                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${viewingCategory.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                    {viewingCategory.status || "—"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Description</p>
                                                <p className="font-body text-sm whitespace-pre-wrap">{viewingCategory.description || "—"}</p>
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

export default CategoryAdmin;
