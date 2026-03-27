import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  fetchCustomersPage,
  updateCustomerStatus,
  type CustomerItem,
  type CustomerStatus,
} from "@/services/admin-service/customer/customer.service";
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
  const [items, setItems] = useState<CustomerItem[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageItems = useMemo((): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const set = new Set<number>();
    set.add(1);
    set.add(totalPages);
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                </TableBody>
              </Table>
                      </div>

          {!loadingCustomers && total > 0 ? (
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:items-center pt-2">
              <p className="text-xs text-muted-foreground font-body order-2 sm:order-1">
                Showing page {page} of {totalPages} ({total} customers)
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
  );
};

export default IndexAdmin;
