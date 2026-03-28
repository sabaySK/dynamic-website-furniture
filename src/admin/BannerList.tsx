import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
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
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Banner {
  id: string;
  name: string;
  page: string;
  image: string;
  preTitle: string;
  title: string;
  subtitle?: string;
}

const emptyBanner: Banner = {
  id: "",
  name: "",
  page: "Home",
  image: "",
  preTitle: "",
  title: "",
  subtitle: "",
};

const BannerList = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [newBanner, setNewBanner] = useState<Banner>(emptyBanner);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    const loadedBanners: Banner[] = [
      {
        id: 'shop-banner',
        name: 'Shop Banner',
        page: 'Shop',
        image: getOverride("shop.banner.image", ""),
        preTitle: getOverride("shop.banner.preTitle", ""),
        title: getOverride("shop.banner.title", ""),
        subtitle: getOverride("shop.banner.subtitle", "")
      },
      {
        id: 'contact-banner',
        name: 'Contact Banner',
        page: 'Contact',
        image: getOverride("contact.banner.image", ""),
        preTitle: getOverride("contact.banner.preTitle", ""),
        title: getOverride("contact.banner.title", "")
      }
    ];
    setBanners(loadedBanners);
  };

  const handleSetNewImageFromFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setNewBanner((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSetEditImageFromFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (editingBanner) {
        setEditingBanner({ ...editingBanner, image: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = async () => {
    if (!newBanner.name.trim() || !newBanner.page.trim() || !newBanner.image.trim() || !newBanner.title.trim()) {
      toast.error("Please fill in Name, Page, Image URL, and Title.");
      return;
    }

    const bannerToAdd: Banner = {
      ...newBanner,
      id: newBanner.name.toLowerCase().replace(/\s+/g, '-'),
    };

    setBanners([...banners, bannerToAdd]);
    setIsAddOpen(false);
    setNewBanner(emptyBanner);
    toast.success("Banner added");
  };

  const startEdit = (b: Banner) => {
    setEditingBanner(b);
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (!editingBanner) return;
    if (!editingBanner.name.trim() || !editingBanner.page.trim() || !editingBanner.image.trim() || !editingBanner.title.trim()) {
      toast.error("Please fill in Name, Page, Image URL, and Title.");
      return;
    }

    setBanners(banners.map((b) => (b.id === editingBanner.id ? editingBanner : b)));
    setIsEditOpen(false);
    setEditingBanner(null);
    toast.success("Banner updated");
  };


  const remove = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(banner => banner.id !== id));
      toast.success("Banner removed");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-semibold">Banners</h3>
                <p className="text-xs text-muted-foreground font-body">Create and manage hero banners for different pages.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewBanner(emptyBanner);
                  setIsAddOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Banner
              </button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table className="table-fixed min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Name</TableHead>
                    <TableHead className="w-[15%]">Page</TableHead>
                    <TableHead className="w-[20%]">Title</TableHead>
                    <TableHead className="w-[20%]">Image</TableHead>
                    <TableHead className="w-[15%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {b.name}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {b.page}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {b.title}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full text-muted-foreground">
                          {b.image ? "Link" : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="flex items-center gap-1">

                          <button
                            type="button"
                            onClick={() => startEdit(b)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(b.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {banners.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                        No banners yet. Create your first banner to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Banner</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Banner Name*</label>
                <input
                  required
                  value={newBanner.name}
                  onChange={(e) => setNewBanner({ ...newBanner, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  placeholder="My Banner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Page*</label>
                <select
                  required
                  value={newBanner.page}
                  onChange={(e) => setNewBanner({ ...newBanner, page: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="Shop">Shop</option>
                  <option value="Contact">Contact</option>
                  <option value="About">About</option>
                  <option value="Blog">Blog</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-body font-medium">Image URL*</label>
              <input
                required
                value={newBanner.image}
                onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="https://example.com/banner.jpg"
              />
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSetNewImageFromFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm flex-1"
                />
                {newBanner.image && newBanner.image.startsWith("data:image") ? (
                  <img src={newBanner.image} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Pre-Title</label>
                <input
                  value={newBanner.preTitle}
                  onChange={(e) => setNewBanner({ ...newBanner, preTitle: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  placeholder="New Collection"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Main Title*</label>
                <input
                  required
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  placeholder="Premium Furniture"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-body font-medium">Subtitle</label>
              <textarea
                value={newBanner.subtitle}
                onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="Discover our exclusive collection..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors">
              Cancel
            </button>
            <button onClick={handleAddSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors">
              Save Banner
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          {editingBanner && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium">Banner Name*</label>
                  <input
                    required
                    value={editingBanner.name}
                    onChange={(e) => setEditingBanner({ ...editingBanner, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium">Page*</label>
                  <select
                    required
                    value={editingBanner.page}
                    onChange={(e) => setEditingBanner({ ...editingBanner, page: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <option value="Home">Home</option>
                    <option value="Shop">Shop</option>
                    <option value="Contact">Contact</option>
                    <option value="About">About</option>
                    <option value="Blog">Blog</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Image URL*</label>
                <input
                  required
                  value={editingBanner.image}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSetEditImageFromFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm flex-1"
                  />
                  {editingBanner.image && editingBanner.image.startsWith("data:image") ? (
                    <img src={editingBanner.image} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium">Pre-Title</label>
                  <input
                    value={editingBanner.preTitle}
                    onChange={(e) => setEditingBanner({ ...editingBanner, preTitle: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium">Main Title*</label>
                  <input
                    required
                    value={editingBanner.title}
                    onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Subtitle</label>
                <textarea
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
              Update Banner
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default BannerList;
