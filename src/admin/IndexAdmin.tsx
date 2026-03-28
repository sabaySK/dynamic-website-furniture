import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
<<<<<<< HEAD
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import TestimonialsSection from "@/components/home/TestimonialsSection";
=======
import {
  fetchCustomersPage,
  updateCustomerStatus,
  type CustomerItem,
  type CustomerStatus,
} from "@/services/admin-service/customer/customer.service";
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
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

const PAGE_SIZE = 10;

const IndexAdmin = () => {
<<<<<<< HEAD
  const [items, setItems] = useState<TestimonialItem[]>(defaultTestimonials);
  const [saving, setSaving] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
=======
  const [items, setItems] = useState<CustomerItem[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageItems = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "dots-right", totalPages] as const;
    if (page >= totalPages - 2) return [1, "dots-left", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
    return [1, "dots-left", page - 1, page, page + 1, "dots-right", totalPages] as const;
  }, [page, totalPages]);

<<<<<<< HEAD
  const [editingCustomer, setEditingCustomer] = useState<TestimonialItem | null>(null);
=======
  const loadCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    try {
      const result = await fetchCustomersPage({ page, limit: PAGE_SIZE }, { suppress401Redirect: true });
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch customers";
      toast.error(msg);
    } finally {
      setLoadingCustomers(false);
    }
  }, [page]);
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    if (loadingCustomers) return;
    if (page > totalPages) setPage(totalPages);
  }, [loadingCustomers, page, totalPages]);

  const handleStatusChange = async (item: CustomerItem, checked: boolean) => {
    if (!item?.id) {
      toast.error("Customer id is missing");
      return;
    }
    const nextStatus: CustomerStatus = checked ? "active" : "inactive";
    if (nextStatus === item.status) return;

    setUpdatingStatusId(item.id);
    try {
      const updated = await updateCustomerStatus(item.id, nextStatus, {
        suppress401Redirect: true,
      });
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                ...(updated ?? {}),
                status: updated?.status ?? nextStatus,
              }
            : it
        )
      );
      toast.success(`Customer ${nextStatus === "active" ? "activated" : "deactivated"}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
    } finally {
      setUpdatingStatusId(null);
    }
<<<<<<< HEAD
    setItems((prev) => [...prev, newCustomer]);
    setNewCustomer({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    });
    setIsAddOpen(false);
  };

  const openEdit = (index: number) => {
    setSelectedIdx(index);
    setEditingCustomer({ ...items[index] });
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (selectedIdx === null || !editingCustomer) return;
    if (!editingCustomer.fullName.trim() || !editingCustomer.phone.trim() || !editingCustomer.password?.trim()) {
      toast.error("Please fill in Name, Phone, and Password.");
      return;
    }
    if (editingCustomer.email.trim() && !editingCustomer.email.trim().endsWith("@gmail.com")) {
      toast.error("Email must be a @gmail.com address.");
      return;
    }
    setItems((prev) => prev.map((it, i) => (i === selectedIdx ? editingCustomer : it)));
    setIsEditOpen(false);
  };


  const updateItem = (index: number, patch: Partial<TestimonialItem>) => {
    setItems((prev) => prev.map((it, i) => (i === selectedIdx ? { ...it, ...patch } : it)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    setSaving(true);
    setOverrides({
      "index.testimonials.items": JSON.stringify(items),
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Customer Stories updated");
    }, 600);
  };

  const cancel = () => {
    const overrideItemsRaw = getOverride("index.testimonials.items", "");
    const parsed = overrideItemsRaw ? safeParseTestimonials(overrideItemsRaw) : null;
    setItems(parsed ?? defaultTestimonials);
=======
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-semibold">Customers</h3>
              <p className="text-xs text-muted-foreground font-body">
                View and manage status of customers
              </p>
                  </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
            <Table className="table-fixed min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                  <TableHead className="w-[12%]">Image</TableHead>
                  <TableHead className="w-[22%]">Name</TableHead>
                    <TableHead className="w-[20%]">Email</TableHead>
                  <TableHead className="w-[16%]">Phone</TableHead>
                  <TableHead className="w-[12%]">Status</TableHead>
                  <TableHead className="w-[18%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {loadingCustomers ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <div className="flex min-h-[200px] items-center justify-center py-8">
                        <Loading
                          size={24}
                          className="text-primary"
                          label="Loading customers"
                          message="Loading customers…"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <Empty
                        title="No customers found"
                        description="There are no customers in this list, or you may not have permission to view them."
                      />
                      </TableCell>
                  </TableRow>
                ) : (
                  items.map((it) => (
                    <TableRow key={String(it.id)}>
                      <TableCell className="truncate">
                        {it.image ? (
                          <img
                            src={it.image}
                            alt={it.name ? `${it.name} avatar` : "Customer avatar"}
                            className="h-10 w-10 rounded object-cover bg-muted"
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="truncate">{it.name || "-"}</TableCell>
                      <TableCell className="truncate">{it.email || "-"}</TableCell>
                      <TableCell className="truncate">{it.phone || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full inline-block border transition-colors ${
                            it.status === "inactive"
                              ? "bg-red-500/10 text-red-600 border-red-600/20"
                              : "bg-green-500/10 text-green-600 border-green-600/20"
                          }`}
                        >
                          {it.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={it.status === "active"}
                            disabled={updatingStatusId === it.id}
                            onCheckedChange={(checked) => {
                              void handleStatusChange(it, checked);
                            }}
                            aria-label={`Toggle status for ${it.name || "customer"} (${it.status})`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {updatingStatusId === it.id ? "Updating..." : it.status === "active" ? "On" : "Off"}
                        </span>
<<<<<<< HEAD
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {it.phone}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {it.address}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="flex items-center gap-1">

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
                            title={items.length <= 1 ? "At least one customer is required" : "Remove"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
=======
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                </TableBody>
              </Table>
                      </div>

<<<<<<< HEAD
              {/* Edit Dialog */}
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Customer</DialogTitle>
                  </DialogHeader>
                  {editingCustomer && (
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Full Name*</label>
                        <input
                          required
                          value={editingCustomer.fullName}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, fullName: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Email</label>
                        <input
                          type="email"
                          pattern=".+@gmail\.com"
                          value={editingCustomer.email}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="john@gmail.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Phone*</label>
                        <input
                          required
                          value={editingCustomer.phone}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Password*</label>
                        <input
                          required
                          type="password"
                          value={editingCustomer.password || ""}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, password: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Address</label>
                        <textarea
                          value={editingCustomer.address}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
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


=======
          {!loadingCustomers && total > 0 ? (
            <div className="flex flex-col gap-3 border-t border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-muted-foreground font-body">
                Showing page {page} of {totalPages} ({total} customers)
              </p>
              <Pagination className="mx-0 w-auto justify-start md:justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                      />
                    </PaginationItem>
                    {pageItems.map((item, idx) =>
                      typeof item === "number" ? (
                        <PaginationItem key={`page-${item}-${idx}`}>
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
                      ) : (
                        <PaginationItem key={`dots-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) setPage(page + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default IndexAdmin;
