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

type PostItem = {
    title: string;
    slug: string;
    content: string;
    status: string;
    featuredImage?: string;
    fileName?: string;
};

const defaultPosts: PostItem[] = [
    {
        title: "Welcome to Our Blog",
        slug: "welcome-blog",
        content: "Hello world",
        status: "active",
    },
];

function safeParsePosts(raw: string): PostItem[] | null {
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        const normalized: PostItem[] = parsed.map((p: any) => ({
            title: typeof p?.title === "string" ? p.title : "",
            slug: typeof p?.slug === "string" ? p.slug : "",
            content: typeof p?.content === "string" ? p.content : "",
            status: typeof p?.status === "string" ? p.status : "active",
            featuredImage: typeof p?.featuredImage === "string" ? p.featuredImage : "",
            fileName: typeof p?.fileName === "string" ? p.fileName : "",
        }));
        return normalized.length > 0 ? normalized : null;
    } catch {
        return null;
    }
}

const PostAdmin = () => {
    const [items, setItems] = useState<PostItem[]>(defaultPosts);
    const [saving, setSaving] = useState(false);
    const [newPostFile, setNewPostFile] = useState<File | null>(null);
    const [editPostFile, setEditPostFile] = useState<File | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const [newPost, setNewPost] = useState<PostItem>({
        title: "",
        slug: "",
        content: "",
        status: "active",
        featuredImage: "",
        fileName: "",
    });

    const [editingPost, setEditingPost] = useState<PostItem | null>(null);
    const [viewingPost, setViewingPost] = useState<PostItem | null>(null);

    useEffect(() => {
        const raw = getOverride("post.items", "");
        const parsed = raw ? safeParsePosts(raw) : null;
        setItems(parsed ?? defaultPosts);
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
        setNewPostFile(file ?? null);
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : "";
            setNewPost((prev) => ({ ...prev, featuredImage: result, fileName: prev.fileName || file.name }));
        };
        reader.readAsDataURL(file);
    };

    const handleSetEditFileFromFile = (file: File | null) => {
        setEditPostFile(file ?? null);
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : "";
            if (editingPost) {
                setEditingPost({ ...editingPost, featuredImage: result, fileName: editingPost.fileName || file.name });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAddSubmit = () => {
        if (!newPost.title.trim()) {
            toast.error("Please fill in the Title.");
            return;
        }
        setItems((prev) => [...prev, newPost]);
        setNewPost({ title: "", slug: "", content: "", status: "active", featuredImage: "", fileName: "" });
        setNewPostFile(null);
        setIsAddOpen(false);
    };

    const openEdit = (index: number) => {
        setSelectedIdx(index);
        setEditingPost({ ...items[index] });
        setEditPostFile(null);
        setIsEditOpen(true);
    };

    const handleEditSubmit = () => {
        if (selectedIdx === null || !editingPost) return;
        if (!editingPost.title.trim()) {
            toast.error("Please fill in the Title.");
            return;
        }
        setItems((prev) => prev.map((it, i) => (i === selectedIdx ? editingPost : it)));
        setIsEditOpen(false);
    };

    const openView = (index: number) => {
        setViewingPost(items[index]);
        setIsViewOpen(true);
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const save = () => {
        setSaving(true);
        setOverrides({ "post.items": JSON.stringify(items) });
        setTimeout(() => {
            setSaving(false);
            toast.success("Posts updated");
        }, 600);
    };

    const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none";

    return (
        <div className="w-full">
            <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
                <div className="p-4 space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-display font-semibold">Posts</h3>
                                <p className="text-xs text-muted-foreground font-body">Manage your blog posts.</p>
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
                                            Add Post
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle>Create Post</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Title*</label>
                                                <input
                                                    required
                                                    value={newPost.title}
                                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                                    className={inputCls}
                                                    placeholder="Welcome to Our Blog"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Slug</label>
                                                <input
                                                    value={newPost.slug}
                                                    onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
                                                    className={inputCls}
                                                    placeholder="welcome-blog"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Content</label>
                                                <textarea
                                                    value={newPost.content}
                                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                                    className={`${inputCls} resize-none`}
                                                    placeholder="Hello world"
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Status</label>
                                                <select
                                                    value={newPost.status}
                                                    onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
                                                    className={inputCls}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="draft">Draft</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Featured Image</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleSetNewFileFromFile(e.target.files?.[0] ?? null)}
                                                        className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                                                    />
                                                    {newPost.featuredImage && (
                                                        <img src={newPost.featuredImage} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                                                    )}
                                                </div>
                                                {newPostFile && (
                                                    <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/40 border border-border rounded-lg">
                                                        <span className="text-xs font-body text-foreground truncate flex-1">
                                                            <span className="font-medium">{newPostFile.name}</span>
                                                            <span className="text-muted-foreground"> : {formatFileSize(newPostFile.size)}</span>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(newPostFile.name)}
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
                                                        value={newPost.fileName ?? ""}
                                                        onChange={(e) => setNewPost({ ...newPost, fileName: e.target.value })}
                                                        className={inputCls}
                                                        placeholder="e.g. post-image.jpg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(newPost.fileName ?? "")}
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
                                                Save Post
                                            </button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="border border-border rounded-lg overflow-hidden">
                            <Table className="table-fixed min-w-[700px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[30%]">Title</TableHead>
                                        <TableHead className="w-[25%]">Slug</TableHead>
                                        <TableHead className="w-[15%]">Status</TableHead>
                                        <TableHead className="w-[30%]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((it, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="p-2 align-middle">
                                                <span className="px-2 py-1.5 text-sm font-body truncate block w-full">{it.title}</span>
                                            </TableCell>
                                            <TableCell className="p-2 align-middle">
                                                <span className="px-2 py-1.5 text-sm font-body truncate block w-full text-muted-foreground">{it.slug || "—"}</span>
                                            </TableCell>
                                            <TableCell className="p-2 align-middle">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${it.status === "active" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
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
                                <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Edit Post</DialogTitle>
                                    </DialogHeader>
                                    {editingPost && (
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Title*</label>
                                                <input
                                                    required
                                                    value={editingPost.title}
                                                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Slug</label>
                                                <input
                                                    value={editingPost.slug}
                                                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Content</label>
                                                <textarea
                                                    value={editingPost.content}
                                                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                                                    className={`${inputCls} resize-none`}
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Status</label>
                                                <select
                                                    value={editingPost.status}
                                                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value })}
                                                    className={inputCls}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="draft">Draft</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-body font-medium">Featured Image</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleSetEditFileFromFile(e.target.files?.[0] ?? null)}
                                                        className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                                                    />
                                                    {editingPost.featuredImage && (
                                                        <img src={editingPost.featuredImage} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                                                    )}
                                                </div>
                                                {editPostFile && (
                                                    <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/40 border border-border rounded-lg">
                                                        <span className="text-xs font-body text-foreground truncate flex-1">
                                                            <span className="font-medium">{editPostFile.name}</span>
                                                            <span className="text-muted-foreground"> : {formatFileSize(editPostFile.size)}</span>
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(editPostFile.name)}
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
                                                        value={editingPost.fileName ?? ""}
                                                        onChange={(e) => setEditingPost({ ...editingPost, fileName: e.target.value })}
                                                        className={inputCls}
                                                        placeholder="e.g. post-image.jpg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(editingPost.fileName ?? "")}
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
                                        <DialogTitle>View Post</DialogTitle>
                                    </DialogHeader>
                                    {viewingPost && (
                                        <div className="grid gap-4 py-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Title</p>
                                                <p className="font-body text-sm font-medium">{viewingPost.title}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Slug</p>
                                                <p className="font-body text-sm">{viewingPost.slug || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Content</p>
                                                <p className="font-body text-sm whitespace-pre-wrap">{viewingPost.content || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Status</p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${viewingPost.status === "active" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                                                    {viewingPost.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">Featured Image</p>
                                                {viewingPost.featuredImage ? (
                                                    <div className="mt-1 rounded-lg overflow-hidden border border-border w-24 h-24">
                                                        <img src={viewingPost.featuredImage} alt={viewingPost.title} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <p className="font-body text-sm">—</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-body">File Name</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="font-body text-sm">{viewingPost.fileName || "—"}</p>
                                                    {viewingPost.fileName && (
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(viewingPost.fileName ?? "")}
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

export default PostAdmin;
