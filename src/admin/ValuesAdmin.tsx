import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Eye, ImageIcon } from "lucide-react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
  createOurValue,
  deleteOurValue,
  fetchOurValuesPage,
  updateOurValue,
  type OurValueItem,
} from "@/services/admin-service/our-value/our-value.service";

type ValueForm = {
  title: string;
  description: string;
};

const PAGE_SIZE = 10;
const emptyForm: ValueForm = {
  title: "",
  description: "",
};

function formatDetailDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(d);
  } catch {
    return null;
  }
}

const ValuesAdmin = () => {
  const [items, setItems] = useState<OurValueItem[]>([]);
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

  const [newForm, setNewForm] = useState<ValueForm>(emptyForm);
  const [newIconFile, setNewIconFile] = useState<File | null>(null);
  const [newIconPreview, setNewIconPreview] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<OurValueItem | null>(null);
  const [editingForm, setEditingForm] = useState<ValueForm>(emptyForm);
  const [editingIconFile, setEditingIconFile] = useState<File | null>(null);
  const [editingIconPreview, setEditingIconPreview] = useState<string | null>(null);

  const [viewingItem, setViewingItem] = useState<OurValueItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<OurValueItem | null>(null);

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
      const res = await fetchOurValuesPage({ page, limit: PAGE_SIZE }, { suppress401Redirect: true });
      setItems(res.list);
      setTotal(res.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch Our Values items";
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
    if (!newForm.title.trim() || !newForm.description.trim()) {
      toast.error("Please fill in the title and description.");
      return;
    }
    setCreating(true);
    try {
      await createOurValue(
        {
          title: newForm.title.trim(),
          description: newForm.description.trim(),
          icon: newIconFile,
        },
        { suppress401Redirect: true }
      );
      toast.success("Value created");
      setIsAddOpen(false);
      setNewForm(emptyForm);
      clearNewIcon();
      if (page !== 1) setPage(1);
      else void loadItems();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create value";
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (item: OurValueItem) => {
    setEditingItem(item);
    setEditingForm({
      title: item.title ?? "",
      description: item.description ?? "",
    });
    setEditingIconFile(null);
    setEditingIconPreview(item.icon ?? null);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingItem) return;
    if (!editingForm.title.trim() || !editingForm.description.trim()) {
      toast.error("Please fill in the title and description.");
      return;
    }
    setUpdating(true);
    try {
      await updateOurValue(
        editingItem.id,
        {
          title: editingForm.title.trim(),
          description: editingForm.description.trim(),
          icon: editingIconFile ?? editingItem.icon ?? null,
        },
        { suppress401Redirect: true }
      );
      toast.success("Value updated");
      setIsEditOpen(false);
      setEditingItem(null);
      clearEditingIcon();
      void loadItems();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update value";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const openView = (item: OurValueItem) => {
    setViewingItem(item);
    setIsViewOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const target = itemToDelete;
    setDeletingId(target.id);
    try {
      await deleteOurValue(target.id, { suppress401Redirect: true });
      toast.success("Value deleted");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      void loadItems();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete value";
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
                <h3 className="text-sm font-display font-semibold">Our Values</h3>
                <p className="text-xs text-muted-foreground font-body">
                  API content from `/admin/about/our-values`.
                </p>
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
                  Add Value
                </button>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Create Value</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <UploadImage
                      label="Icon"
                      previewUrl={newIconPreview}
                      onFileSelect={handlePickNewIcon}
                      onRemove={clearNewIcon}
                      disabled={creating}
                    />
                    <div className="space-y-2">
                      <label className="text-xs font-body font-medium">Title*</label>
                      <input
                        required
                        value={newForm.title}
                        onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="Craftsmanship"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-body font-medium">Description*</label>
                      <textarea
                        required
                        value={newForm.description}
                        onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                        placeholder="Describe this value..."
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
                      disabled={creating}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {creating ? "Saving..." : "Save Value"}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <div className="flex min-h-[180px] items-center justify-center py-8">
                          <Loading size={24} className="text-primary" message="Loading values..." />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <Empty
                          title="No values found"
                          description="No record was returned from /admin/about/our-values."
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((it) => (
                      <TableRow key={String(it.id)}>
                        <TableCell className="p-2 align-middle text-center">
                          {it.icon ? (
                            <img src={it.icon} alt="" className="h-8 w-8 object-contain mx-auto" />
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
                            {it.description ?? "—"}
                          </span>
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
                title="Delete value?"
                description={
                  itemToDelete
                    ? `This will permanently remove "${itemToDelete.title}". This action cannot be undone.`
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
                    <DialogTitle>Edit Value</DialogTitle>
                  </DialogHeader>
                  {editingItem && (
                    <div className="grid gap-4 py-4">
                      <UploadImage
                        label="Icon"
                        previewUrl={editingIconPreview}
                        onFileSelect={handlePickEditingIcon}
                        onRemove={clearEditingIcon}
                        disabled={updating}
                      />
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Title*</label>
                        <input
                          required
                          value={editingForm.title}
                          onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Description*</label>
                        <textarea
                          required
                          value={editingForm.description}
                          onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          rows={3}
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
                      {updating ? "Saving..." : "Save"}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-[440px] gap-0 overflow-hidden p-0 sm:max-w-[480px]">
                  {viewingItem ? (
                    <>
                      <div className="relative bg-gradient-to-b from-muted/60 via-muted/30 to-background px-6 pb-6 pt-8">
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.35]"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 30% 20%, hsl(var(--primary) / 0.12), transparent 45%), radial-gradient(circle at 80% 0%, hsl(var(--primary) / 0.08), transparent 40%)",
                          }}
                        />
                        <DialogHeader className="relative space-y-0 text-center sm:text-center">
                          <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-2xl border border-border/80 bg-background/80 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10">
                            {viewingItem.icon ? (
                              <img
                                src={viewingItem.icon}
                                alt=""
                                className="h-[68px] w-[68px] rounded-xl object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted/50">
                                <ImageIcon className="h-9 w-9 text-muted-foreground/45" strokeWidth={1.25} />
                              </div>
                            )}
                          </div>
                          <DialogTitle className="mt-5 px-1 font-display text-xl font-semibold leading-snug tracking-tight text-foreground">
                            {viewingItem.title || "Untitled value"}
                          </DialogTitle>
                          <DialogDescription className="mx-auto max-w-[320px] pt-1.5 text-xs font-body text-muted-foreground">
                            Our Values · public-facing content for the About page
                          </DialogDescription>
                        </DialogHeader>
                      </div>

                      <div className="space-y-4 px-6 py-5">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground font-body">
                            Description
                          </p>
                          <div className="mt-2.5 rounded-xl border border-border/70 bg-muted/25 px-4 py-3.5 shadow-inner">
                            <p className="text-sm font-body leading-relaxed text-foreground/90 whitespace-pre-wrap">
                              {viewingItem.description?.trim()
                                ? viewingItem.description
                                : "No description provided."}
                            </p>
                          </div>
                        </div>

                        {(formatDetailDate(viewingItem.updated_at) || formatDetailDate(viewingItem.created_at)) && (
                          <>
                            <Separator className="bg-border/80" />
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-body text-muted-foreground">
                              {formatDetailDate(viewingItem.created_at) ? (
                                <div>
                                  <span className="font-medium text-foreground/70">Created</span>
                                  <span className="ml-2 tabular-nums">{formatDetailDate(viewingItem.created_at)}</span>
                                </div>
                              ) : null}
                              {formatDetailDate(viewingItem.updated_at) ? (
                                <div>
                                  <span className="font-medium text-foreground/70">Updated</span>
                                  <span className="ml-2 tabular-nums">{formatDetailDate(viewingItem.updated_at)}</span>
                                </div>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>

                      <DialogFooter className="border-t border-border/80 bg-muted/15 px-6 py-4 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setIsViewOpen(false)}
                          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-body font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:w-auto sm:min-w-[120px]"
                        >
                          Close
                        </button>
                      </DialogFooter>
                    </>
                  ) : null}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuesAdmin;
