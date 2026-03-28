<<<<<<< HEAD
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
=======
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Eye, Trash2 } from "lucide-react";
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
import { toast } from "sonner";
import Loading from "@/components/ui/loading";
import Empty from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UploadImage from "@/components/UploadImage";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import {
  createBanner,
  deleteBanner,
  fetchBannersPage,
  updateBanner,
  type BannerItem,
  type BannerPosition,
  type BannerStatus,
} from "@/services/admin-service/banner/banner.service";

const PAGE_SIZE = 10;
const defaultNewBanner = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  link: "",
  position: "home" as BannerPosition,
  status: "active" as BannerStatus,
  sort_order: "1",
};

const BannerList = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [creatingBanner, setCreatingBanner] = useState(false);
  const [newBanner, setNewBanner] = useState(defaultNewBanner);
  const [newBannerImageFile, setNewBannerImageFile] = useState<File | null>(null);
  const [newBannerImagePreview, setNewBannerImagePreview] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
<<<<<<< HEAD

  const [newBanner, setNewBanner] = useState<Banner>(emptyBanner);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
=======
  const [updatingBanner, setUpdatingBanner] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [editingForm, setEditingForm] = useState(defaultNewBanner);
  const [editingBannerImageFile, setEditingBannerImageFile] = useState<File | null>(null);
  const [editingBannerImagePreview, setEditingBannerImagePreview] = useState<string | null>(null);
  const [viewingBanner, setViewingBanner] = useState<BannerItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBanner, setDeletingBanner] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<BannerItem | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageItems = useMemo((): (number | "ellipsis")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const set = new Set<number>([1, totalPages]);
    for (let p = page - 1; p <= page + 1; p++) {
      if (p >= 1 && p <= totalPages) set.add(p);
    }
    const sorted = [...set].sort((a, b) => a - b);
    const out: (number | "ellipsis")[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("ellipsis");
      out.push(sorted[i]);
    }
    return out;
  }, [page, totalPages]);
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2

  useEffect(() => {
    const loadBanners = async () => {
      setLoadingBanners(true);
      try {
        const res = await fetchBannersPage({ page, limit: PAGE_SIZE }, { suppress401Redirect: true });
        setBanners(res.list);
        setTotal(res.total);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to fetch banners";
        toast.error(msg);
      } finally {
        setLoadingBanners(false);
      }
    };
    void loadBanners();
  }, [page, reloadKey]);

  useEffect(() => {
    if (!loadingBanners && page > totalPages) setPage(totalPages);
  }, [loadingBanners, page, totalPages]);

  useEffect(() => {
    return () => {
      if (newBannerImagePreview && newBannerImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(newBannerImagePreview);
      }
      if (editingBannerImagePreview && editingBannerImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(editingBannerImagePreview);
      }
    };
  }, [newBannerImagePreview, editingBannerImagePreview]);

<<<<<<< HEAD
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

=======
  const startView = (banner: BannerItem) => {
    setViewingBanner(banner);
    setIsViewOpen(true);
  };
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2

  const startEdit = (banner: BannerItem) => {
    setEditingBanner(banner);
    setEditingForm({
      title: banner.title ?? "",
      subtitle: banner.subtitle ?? "",
      description: banner.description ?? "",
      image: banner.image ?? "",
      link: banner.link ?? "",
      position: (banner.position as BannerPosition) ?? "home",
      status: banner.status,
      sort_order: String(banner.sort_order ?? 1),
    });
    setEditingBannerImageFile(null);
    setEditingBannerImagePreview(banner.image ?? null);
    setIsEditOpen(true);
  };

  const handleCreateBanner = async () => {
    if (!newBanner.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!newBanner.image.trim()) {
      toast.error("Image is required");
      return;
    }
    const sortOrder = Number(newBanner.sort_order);
    if (!Number.isFinite(sortOrder) || sortOrder < 0) {
      toast.error("Sort order must be a valid number");
      return;
    }

    setCreatingBanner(true);
    try {
      const payload = {
        title: newBanner.title.trim(),
        subtitle: newBanner.subtitle.trim() || null,
        description: newBanner.description.trim() || null,
        image: newBanner.image.trim() || null,
        link: newBanner.link.trim() || null,
        position: newBanner.position,
        status: newBanner.status,
        sort_order: sortOrder,
      };

      await createBanner(payload, { suppress401Redirect: true });
      toast.success("Banner created");
      setIsAddOpen(false);
      setNewBanner(defaultNewBanner);
      setNewBannerImageFile(null);
      setNewBannerImagePreview(null);
      setPage(1);
      setReloadKey((k) => k + 1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create banner";
      toast.error(msg);
    } finally {
      setCreatingBanner(false);
    }
  };

  const handlePickNewBannerImage = (file: File) => {
    setNewBannerImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setNewBannerImagePreview(objectUrl);

    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      setNewBanner((prev) => ({ ...prev, image: value }));
    };
    reader.readAsDataURL(file);
  };

  const clearNewBannerImage = () => {
    if (newBannerImagePreview && newBannerImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(newBannerImagePreview);
    }
    setNewBannerImageFile(null);
    setNewBannerImagePreview(null);
    setNewBanner((prev) => ({ ...prev, image: "" }));
  };

  const handlePickEditingBannerImage = (file: File) => {
    setEditingBannerImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setEditingBannerImagePreview(objectUrl);

    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      setEditingForm((prev) => ({ ...prev, image: value }));
    };
    reader.readAsDataURL(file);
  };

  const clearEditingBannerImage = () => {
    if (editingBannerImagePreview && editingBannerImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(editingBannerImagePreview);
    }
    setEditingBannerImageFile(null);
    setEditingBannerImagePreview(null);
    setEditingForm((prev) => ({ ...prev, image: "" }));
  };

  const handleUpdateBanner = async () => {
    if (!editingBanner?.id) {
      toast.error("Banner id is missing");
      return;
    }
    if (!editingForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editingForm.image.trim()) {
      toast.error("Image is required");
      return;
    }
    const sortOrder = Number(editingForm.sort_order);
    if (!Number.isFinite(sortOrder) || sortOrder < 0) {
      toast.error("Sort order must be a valid number");
      return;
    }

    setUpdatingBanner(true);
    try {
      const payload = {
        title: editingForm.title.trim(),
        subtitle: editingForm.subtitle.trim() || null,
        description: editingForm.description.trim() || null,
        image: editingForm.image.trim() || null,
        link: editingForm.link.trim() || null,
        position: editingForm.position,
        status: editingForm.status,
        sort_order: sortOrder,
      };

      await updateBanner(editingBanner.id, payload, { suppress401Redirect: true });
      toast.success("Banner updated");
      setIsEditOpen(false);
      setEditingBanner(null);
      setEditingBannerImageFile(null);
      setEditingBannerImagePreview(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update banner";
      toast.error(msg);
    } finally {
      setUpdatingBanner(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete?.id) {
      toast.error("Banner id is missing");
      return;
    }
    setDeletingBanner(true);
    try {
      await deleteBanner(bannerToDelete.id, { suppress401Redirect: true });
      toast.success("Banner deleted");
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete banner";
      toast.error(msg);
      throw err;
    } finally {
      setDeletingBanner(false);
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
                  if (newBannerImagePreview && newBannerImagePreview.startsWith("blob:")) {
                    URL.revokeObjectURL(newBannerImagePreview);
                  }
                  setNewBanner(defaultNewBanner);
                  setNewBannerImageFile(null);
                  setNewBannerImagePreview(null);
                  setIsAddOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
              >
                Create Banner
              </button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table className="table-fixed min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Image</TableHead>
                    <TableHead className="w-[30%]">Title</TableHead>
                    <TableHead className="w-[20%]">Subtitle</TableHead>
                    <TableHead className="w-[15%]">Position</TableHead>
                    <TableHead className="w-[15%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingBanners ? (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className="flex min-h-[180px] items-center justify-center py-8">
                          <Loading size={24} message="Loading banners..." className="text-primary" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : banners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <Empty title="No banners found" description="No banner records were returned from the API." />
                      </TableCell>
                    </TableRow>
                  ) : banners.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="p-2 align-middle">
                        {b.image ? (
                          <img src={b.image} alt={b.title} className="h-12 w-24 object-cover rounded border border-border" />
                        ) : (
                          <span className="px-2 py-1.5 text-sm font-body truncate block w-full text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {b.title}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {b.subtitle || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {b.position}
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
                            onClick={() => {
                              setBannerToDelete(b);
                              setDeleteDialogOpen(true);
                            }}
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
            </div>
            {!loadingBanners && total > 0 ? (
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:items-center pt-2">
                <p className="text-xs text-muted-foreground font-body order-2 sm:order-1">
                  Showing page {page} of {totalPages} ({total} banners)
                </p>
                {totalPages > 1 ? (
                  <Pagination className="order-1 sm:order-2 mx-0 w-full sm:w-auto justify-center sm:justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage((p) => p - 1);
                          }}
                        />
                      </PaginationItem>
                      {pageItems.map((item, idx) =>
                        item === "ellipsis" ? (
                          <PaginationItem key={`e-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              href="#"
                              isActive={item === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(item);
                              }}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage((p) => p + 1);
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Banner</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-body font-medium">Title*</label>
              <input
                value={newBanner.title}
                onChange={(e) => setNewBanner((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="Live with intention."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-body font-medium">Subtitle</label>
              <input
                value={newBanner.subtitle}
                onChange={(e) => setNewBanner((prev) => ({ ...prev, subtitle: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="New Collection 2026"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-body font-medium">Description</label>
              <textarea
                value={newBanner.description}
                onChange={(e) => setNewBanner((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                rows={3}
                placeholder="Handcrafted furniture that brings warmth..."
              />
            </div>

            <UploadImage
              label="Banner Image*"
              previewUrl={newBannerImagePreview}
              onFileSelect={handlePickNewBannerImage}
              onRemove={clearNewBannerImage}
              disabled={creatingBanner}
            />

            <div className="space-y-2">
              <label className="text-xs font-body font-medium">Link</label>
              <input
                value={newBanner.link}
                onChange={(e) => setNewBanner((prev) => ({ ...prev, link: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Position*</label>
                <Select
                  value={newBanner.position}
                  onValueChange={(value) =>
                    setNewBanner((prev) => ({ ...prev, position: value as BannerPosition }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">home</SelectItem>
                    <SelectItem value="shop">shop</SelectItem>
                    <SelectItem value="about_us">about_us</SelectItem>
                    <SelectItem value="contact">contact</SelectItem>
                    <SelectItem value="blog">blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Status*</label>
                <Select
                  value={newBanner.status}
                  onValueChange={(value) =>
                    setNewBanner((prev) => ({ ...prev, status: value as BannerStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="inactive">inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Sort Order*</label>
                <input
                  type="number"
                  min={0}
                  value={newBanner.sort_order}
                  onChange={(e) => setNewBanner((prev) => ({ ...prev, sort_order: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                if (newBannerImagePreview && newBannerImagePreview.startsWith("blob:")) {
                  URL.revokeObjectURL(newBannerImagePreview);
                }
                setIsAddOpen(false);
              }}
              className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateBanner}
              disabled={creatingBanner}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {creatingBanner ? "Creating..." : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setBannerToDelete(null);
        }}
        title="Delete banner?"
        description={
          bannerToDelete
            ? `This will permanently remove "${bannerToDelete.title}". This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        loading={deletingBanner}
        onConfirm={handleDeleteBanner}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          {editingBanner && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Title*</label>
                <input
                  value={editingForm.title}
                  onChange={(e) => setEditingForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Subtitle</label>
                <input
                  value={editingForm.subtitle}
                  onChange={(e) => setEditingForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Description</label>
                <textarea
                  value={editingForm.description}
                  onChange={(e) => setEditingForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  rows={3}
                />
              </div>
              <UploadImage
                label="Banner Image*"
                previewUrl={editingBannerImagePreview}
                onFileSelect={handlePickEditingBannerImage}
                onRemove={clearEditingBannerImage}
                disabled={updatingBanner}
              />
              <div className="space-y-2">
                <label className="text-xs font-body font-medium">Link</label>
                <input
                  value={editingForm.link}
                  onChange={(e) => setEditingForm((prev) => ({ ...prev, link: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium">Position*</label>
                  <Select
                    value={editingForm.position}
                    onValueChange={(value) =>
                      setEditingForm((prev) => ({ ...prev, position: value as BannerPosition }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">home</SelectItem>
                      <SelectItem value="shop">shop</SelectItem>
                      <SelectItem value="about_us">about_us</SelectItem>
                      <SelectItem value="contact">contact</SelectItem>
                      <SelectItem value="blog">blog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium">Status*</label>
                  <Select
                    value={editingForm.status}
                    onValueChange={(value) =>
                      setEditingForm((prev) => ({ ...prev, status: value as BannerStatus }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">active</SelectItem>
                      <SelectItem value="inactive">inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium">Sort Order*</label>
                  <input
                    type="number"
                    min={0}
                    value={editingForm.sort_order}
                    onChange={(e) => setEditingForm((prev) => ({ ...prev, sort_order: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => {
                if (editingBannerImagePreview && editingBannerImagePreview.startsWith("blob:")) {
                  URL.revokeObjectURL(editingBannerImagePreview);
                }
                setIsEditOpen(false);
              }}
              className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateBanner}
              disabled={updatingBanner}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {updatingBanner ? "Updating..." : "Update"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

<<<<<<< HEAD

=======
      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
          <DialogHeader>
            <DialogTitle className="sr-only">View Banner</DialogTitle>
          </DialogHeader>
          {viewingBanner && (
            <div>
              <div className="px-4 pt-4">
                <div className="relative h-72 w-full overflow-hidden rounded-lg border border-border bg-muted">
                  {viewingBanner.image ? (
                    <img src={viewingBanner.image} alt={viewingBanner.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      No banner image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-white/20 px-2 py-1 text-[11px] uppercase tracking-wider">
                        {viewingBanner.position}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] uppercase tracking-wider ${
                          viewingBanner.status === "active"
                            ? "bg-green-500/25 text-green-100"
                            : "bg-red-500/25 text-red-100"
                        }`}
                      >
                        {viewingBanner.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-display leading-tight">{viewingBanner.title}</h2>
                    <p className="mt-1 text-sm text-white/90">{viewingBanner.subtitle || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Position</p>
                    <p className="mt-1 text-sm font-medium">{viewingBanner.position}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Sort Order</p>
                    <p className="mt-1 text-sm font-medium">{viewingBanner.sort_order}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-body">Description</p>
                  <p className="mt-1 text-sm leading-relaxed">{viewingBanner.description || "—"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="border-t border-border p-4">
            <button onClick={() => setIsViewOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors">
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
    </div>
  );
};

export default BannerList;
