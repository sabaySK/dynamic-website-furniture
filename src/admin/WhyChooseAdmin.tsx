import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@/components/ui/dialog";
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
import UploadImage from "@/components/UploadImage";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import {
  createWhyChoose,
  deleteWhyChoose,
  fetchWhyChoosePage,
  updateWhyChoose,
  type WhyChooseItem,
} from "@/services/admin-service/why-choose-us/why-choose-use.service";

type WhyChooseForm = {
  content: string;
};

const PAGE_SIZE = 10;
const emptyForm: WhyChooseForm = {
  content: "",
};

const WhyChooseAdmin = () => {
  const [items, setItems] = useState<WhyChooseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [newForm, setNewForm] = useState<WhyChooseForm>(emptyForm);
  const [newIconFile, setNewIconFile] = useState<File | null>(null);
  const [newIconPreview, setNewIconPreview] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<WhyChooseItem | null>(null);
  const [editingForm, setEditingForm] = useState<WhyChooseForm>(emptyForm);
  const [editingIconFile, setEditingIconFile] = useState<File | null>(null);
  const [editingIconPreview, setEditingIconPreview] = useState<string | null>(null);

  const [viewingItem, setViewingItem] = useState<WhyChooseItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<WhyChooseItem | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "dots-right", totalPages] as const;
    if (page >= totalPages - 2) return [1, "dots-left", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
    return [1, "dots-left", page - 1, page, page + 1, "dots-right", totalPages] as const;
  }, [page, totalPages]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWhyChoosePage({ page, limit: PAGE_SIZE }, { suppress401Redirect: true });
      setItems(res.list);
      setTotal(res.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch Why Choose items";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    return () => {
      if (newIconPreview?.startsWith("blob:")) URL.revokeObjectURL(newIconPreview);
      if (editingIconPreview?.startsWith("blob:")) URL.revokeObjectURL(editingIconPreview);
    };
  }, [newIconPreview, editingIconPreview]);

  const handlePickNewIcon = (file: File) => {
    if (newIconPreview?.startsWith("blob:")) URL.revokeObjectURL(newIconPreview);
    setNewIconFile(file);
    setNewIconPreview(URL.createObjectURL(file));
  };

  const clearNewIcon = () => {
    if (newIconPreview?.startsWith("blob:")) URL.revokeObjectURL(newIconPreview);
    setNewIconFile(null);
    setNewIconPreview(null);
  };

  const handlePickEditingIcon = (file: File) => {
    if (editingIconPreview?.startsWith("blob:")) URL.revokeObjectURL(editingIconPreview);
    setEditingIconFile(file);
    setEditingIconPreview(URL.createObjectURL(file));
  };

  const clearEditingIcon = () => {
    if (editingIconPreview?.startsWith("blob:")) URL.revokeObjectURL(editingIconPreview);
    setEditingIconFile(null);
    setEditingIconPreview(null);
  };

  const handleAddSubmit = async () => {
    if (!newForm.content.trim()) {
      toast.error("Please fill in content.");
      return;
    }
    setCreating(true);
    try {
      await createWhyChoose(
        {
          content: newForm.content.trim(),
          icon: newIconFile,
        },
        { suppress401Redirect: true }
      );
      toast.success("Item created");
      setIsAddOpen(false);
      setNewForm(emptyForm);
      clearNewIcon();
      if (page !== 1) setPage(1);
      else void loadItems();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create item";
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (item: WhyChooseItem) => {
    setEditingItem(item);
    setEditingForm({ content: item.content ?? "" });
    setEditingIconFile(null);
    setEditingIconPreview(item.icon ?? null);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingItem) return;
    if (!editingForm.content.trim()) {
      toast.error("Please fill in content.");
      return;
    }
    setUpdating(true);
    try {
      await updateWhyChoose(
        editingItem.id,
        {
          content: editingForm.content.trim(),
          icon: editingIconFile ?? editingItem.icon ?? null,
        },
        { suppress401Redirect: true }
      );
      toast.success("Item updated");
      setIsEditOpen(false);
      setEditingItem(null);
      clearEditingIcon();
      void loadItems();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update item";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const openView = (item: WhyChooseItem) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const target = itemToDelete;
    setDeletingId(target.id);
    try {
      await deleteWhyChoose(target.id, { suppress401Redirect: true });
      toast.success("Item deleted");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      void loadItems();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete item";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-semibold">Why Choose Us</h3>
                <p className="text-xs text-muted-foreground font-body">API content from `/admin/about/why-choose`.</p>
              </div>
              <Dialog
                open={isAddOpen}
                onOpenChange={(open) => {
                  setIsAddOpen(open);
                  if (!open) {
                    setNewForm(emptyForm);
                    clearNewIcon();
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Create Item</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <UploadImage
                      label="Icon Image"
                      previewUrl={newIconPreview}
                      onFileSelect={handlePickNewIcon}
                      onRemove={clearNewIcon}
                      disabled={creating}
                    />
                    <div className="space-y-2">
                      <label className="text-xs font-body font-medium">Content*</label>
                      <textarea
                        required
                        value={newForm.content}
                        onChange={(e) => setNewForm({ content: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                        rows={4}
                        placeholder="Handcrafted by skilled artisans using traditional techniques"
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
                      disabled={creating}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {creating ? "Saving..." : "Save Item"}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[72px]">Icon</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead className="w-[120px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="p-0">
                        <div className="flex min-h-[180px] items-center justify-center py-8">
                          <Loading size={24} className="text-primary" message="Loading items..." />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="p-0">
                        <Empty title="No items found" description="No record was returned from /admin/about/why-choose." />
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((it) => (
                      <TableRow key={String(it.id)}>
                        <TableCell className="py-2 pl-2 pr-1 align-middle">
                          {it.icon ? (
                            <img src={it.icon} alt="Icon" className="h-10 w-10 object-contain rounded border border-border p-1" />
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-2 pl-1 pr-2 align-middle">
                          <span className="py-1.5 text-sm font-body line-clamp-2 block w-full">{it.content || "-"}</span>
                        </TableCell>
                        <TableCell className="p-2 align-middle">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openView(it)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEdit(it)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setItemToDelete(it);
                                setDeleteDialogOpen(true);
                              }}
                              disabled={deletingId === it.id}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-60"
                              title="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {!loading && total > 0 ? (
                <div className="flex flex-col gap-3 border-t border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-muted-foreground font-body">
                    Showing page {page} of {totalPages} ({total} items)
                  </p>
                  <Pagination className="mx-0 w-auto justify-start md:justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {pageItems.map((p, idx) =>
                        typeof p === "number" ? (
                          <PaginationItem key={`page-${p}-${idx}`}>
                            <PaginationLink
                              href="#"
                              isActive={p === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(p);
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`dots-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              ) : null}

              <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                  setDeleteDialogOpen(open);
                  if (!open) setItemToDelete(null);
                }}
                title="Delete item?"
                description={
                  itemToDelete
                    ? `This will permanently remove "${itemToDelete.content}". This action cannot be undone.`
                    : "This action cannot be undone."
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                destructive
                loading={Boolean(itemToDelete && deletingId === itemToDelete.id)}
                onConfirm={handleDelete}
              />

              <Dialog
                open={isEditOpen}
                onOpenChange={(open) => {
                  setIsEditOpen(open);
                  if (!open) {
                    setEditingItem(null);
                    setEditingForm(emptyForm);
                    clearEditingIcon();
                  }
                }}
              >
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Edit Item</DialogTitle>
                  </DialogHeader>
                  {editingItem && (
                    <div className="grid gap-4 py-4">
                      <UploadImage
                        label="Icon Image"
                        previewUrl={editingIconPreview}
                        onFileSelect={handlePickEditingIcon}
                        onRemove={clearEditingIcon}
                        disabled={updating}
                      />
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Content*</label>
                        <textarea
                          required
                          value={editingForm.content}
                          onChange={(e) => setEditingForm({ content: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          rows={4}
                        />
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
                      disabled={updating}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
                            <img src={viewingItem.icon} alt="Icon" className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <p className="font-body text-sm">-</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Content</p>
                        <p className="font-body text-sm whitespace-pre-wrap">{viewingItem.content || "-"}</p>
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

export default WhyChooseAdmin;
