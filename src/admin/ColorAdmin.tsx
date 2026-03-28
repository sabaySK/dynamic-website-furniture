import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Eye, Copy } from "lucide-react";
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

type ColorItem = {
    value: string;
    fileName?: string;
};

const defaultColors: ColorItem[] = [
    { value: "Red" },
    { value: "Blue" },
    { value: "Green" },
];

function safeParseColors(raw: string): ColorItem[] | null {
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        const normalized: ColorItem[] = parsed.map((c: any) => ({
            value: typeof c?.value === "string" ? c.value : "",
            fileName: typeof c?.fileName === "string" ? c.fileName : "",
        }));
        return normalized.length > 0 ? normalized : null;
    } catch {
        return null;
    }
}

const ColorAdmin = () => {
    const [items, setItems] = useState<ColorItem[]>(defaultColors);
    const [saving, setSaving] = useState(false);
    const [newColorFile, setNewColorFile] = useState<File | null>(null);
    const [editColorFile, setEditColorFile] = useState<File | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const [newColor, setNewColor] = useState<ColorItem>({
        value: "",
        fileName: "",
    });

    const [editingColor, setEditingColor] = useState<ColorItem | null>(null);
    const [viewingColor, setViewingColor] = useState<ColorItem | null>(null);

    useEffect(() => {
        const raw = getOverride("color.items", "");
        const parsed = raw ? safeParseColors(raw) : null;
        setItems(parsed ?? defaultColors);
    }, []);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => toast.success("Copied!"));
    };

    const handleSetNewFileFromFile = (file: File | null) => {
        setNewColorFile(file ?? null);
        if (!file) return;
        setNewColor((prev) => ({ ...prev, fileName: prev.fileName || file.name }));
    };

    const handleSetEditFileFromFile = (file: File | null) => {
        setEditColorFile(file ?? null);
        if (!file) return;
        if (editingColor) {
            setEditingColor({ ...editingColor, fileName: editingColor.fileName || file.name });
        }
    };

    const handleAddSubmit = () => {
        if (!newColor.value.trim()) {
            toast.error("Please fill in the Color Value.");
            return;
        }
        setItems((prev) => [...prev, newColor]);
        setNewColor({ value: "", fileName: "" });
        setNewColorFile(null);
        setIsAddOpen(false);
    };

    const openEdit = (index: number) => {
        setSelectedIdx(index);
        setEditingColor({ ...items[index] });
        setEditColorFile(null);
        setIsEditOpen(true);
    };

    const handleEditSubmit = () => {
        if (selectedIdx === null || !editingColor) return;
        if (!editingColor.value.trim()) {
            toast.error("Please fill in the Color Value.");
            return;
        }
        setItems((prev) => prev.map((it, i) => (i === selectedIdx ? editingColor : it)));
        setIsEditOpen(false);
    };

    const openView = (index: number) => {
        setViewingColor(items[index]);
        setIsViewOpen(true);
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const save = () => {
        setSaving(true);
        setOverrides({
            "color.items": JSON.stringify(items),
        });
        setTimeout(() => {
            setSaving(false);
            toast.success("Colors updated");
        }, 600);
    };

    return (
        <div className="w-full">
            <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
                <div className="p-4 space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-display font-semibold">Colors</h3>
                                <p className="text-xs text-muted-foreground font-body">Manage your product colors.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Add Dialog */}
                                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Color
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create Color</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Color Value*</label>
                                                <input
                                                    required
                                                    value={newColor.value}
                                                    onChange={(e) => setNewColor({ ...newColor, value: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                    placeholder="e.g. Red"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">File</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleSetNewFileFromFile(e.target.files?.[0] ?? null)}
                                                        className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                                                    />
                                                </div>
                                                {newColorFile && (
                                                    <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/40 border border-border rounded-lg">
                                                        <span className="text-xs font-body text-foreground truncate flex-1">
                                                            <span className="font-medium">{newColorFile.name}</span>
                                                            <span className="text-muted-foreground"> : {formatFileSize(newColorFile.size)}</span>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(newColorFile.name)}
                                                            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                                            title="Copy file name"
                                                        >
                                                            <Copy className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">File Name</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        value={newColor.fileName ?? ""}
                                                        onChange={(e) => setNewColor({ ...newColor, fileName: e.target.value })}
                                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                        placeholder="e.g. color-red.jpg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(newColor.fileName ?? "")}
                                                        className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                                        title="Copy file name"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </button>
                                                </div>
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
                                                Save Color
                                            </button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="border border-border rounded-lg overflow-hidden">
                            <Table className="table-fixed min-w-[500px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60%]">Color Value</TableHead>
                                        <TableHead className="w-[40%]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((it, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="p-2 align-middle">
                                                <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                                                    {it.value}
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
                                        <DialogTitle>Edit Color</DialogTitle>
                                    </DialogHeader>
                                    {editingColor && (
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Color Value*</label>
                                                <input
                                                    required
                                                    value={editingColor.value}
                                                    onChange={(e) => setEditingColor({ ...editingColor, value: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">File</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleSetEditFileFromFile(e.target.files?.[0] ?? null)}
                                                        className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                                                    />
                                                </div>
                                                {editColorFile && (
                                                    <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/40 border border-border rounded-lg">
                                                        <span className="text-xs font-body text-foreground truncate flex-1">
                                                            <span className="font-medium">{editColorFile.name}</span>
                                                            <span className="text-muted-foreground"> : {formatFileSize(editColorFile.size)}</span>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(editColorFile.name)}
                                                            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                                            title="Copy file name"
                                                        >
                                                            <Copy className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">File Name</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        value={editingColor.fileName ?? ""}
                                                        onChange={(e) => setEditingColor({ ...editingColor, fileName: e.target.value })}
                                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                        placeholder="e.g. color-red.jpg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(editingColor.fileName ?? "")}
                                                        className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                                        title="Copy file name"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <DialogFooter>
                                        <button
                                            onClick={() => setIsEditOpen(false)}
                                            className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleEditSubmit}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* View Dialog */}
                            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>View Color</DialogTitle>
                                    </DialogHeader>
                                    {viewingColor && (
                                        <div className="grid gap-4 py-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Color Value</p>
                                                <p className="font-body text-sm font-medium">{viewingColor.value}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">File Name</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="font-body text-sm">{viewingColor.fileName || "—"}</p>
                                                    {viewingColor.fileName && (
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(viewingColor.fileName ?? "")}
                                                            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                                            title="Copy file name"
                                                        >
                                                            <Copy className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <DialogFooter>
                                        <button
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

export default ColorAdmin;
