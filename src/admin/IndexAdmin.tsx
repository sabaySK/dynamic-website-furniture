import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Eye } from "lucide-react";
import TestimonialsSection from "@/components/home/TestimonialsSection";
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

type TestimonialItem = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
};

const defaultTestimonials: TestimonialItem[] = [
  {
    fullName: "Anna K.",
    email: "saff@gmail.com",
    phone: "0968255000",
    address: "The Nordic Linen Sofa transformed our living room. The craftsmanship is incredible — you can feel the quality the moment you sit down.",
  },
  {
    fullName: "Marcus T.",
    email: "saff@gmail.com",
    phone: "0968255000",
    address: "We ordered the Artisan Dining Table and it's even more beautiful in person. Our family gathers around it every evening now.",
  },
  {
    fullName: "Sophie L.",
    email: "saff@gmail.com",
    phone: "0968255000",
    address: "Exceptional quality and the design consultation was so helpful. The team helped us furnish our entire apartment in one cohesive style.",
  },
];

function safeParseTestimonials(raw: string): TestimonialItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized: TestimonialItem[] = parsed.map((t: any) => {
      return {
        fullName: typeof t?.fullName === "string" ? t.fullName : (typeof t?.name === "string" ? t.name : ""),
        email: typeof t?.email === "string" ? t.email : (typeof t?.location === "string" ? t.location : ""),
        phone: typeof t?.phone === "string" ? t.phone : (t?.rating != null ? String(t.rating) : ""),
        address: typeof t?.address === "string" ? t.address : (typeof t?.text === "string" ? t.text : ""),
      };
    });
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

const IndexAdmin = () => {
  const [items, setItems] = useState<TestimonialItem[]>(defaultTestimonials);
  const [saving, setSaving] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [newCustomer, setNewCustomer] = useState<TestimonialItem>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editingCustomer, setEditingCustomer] = useState<TestimonialItem | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<TestimonialItem | null>(null);

  useEffect(() => {
    const overrideItemsRaw = getOverride("index.testimonials.items", "");
    const parsed = overrideItemsRaw ? safeParseTestimonials(overrideItemsRaw) : null;
    setItems(parsed ?? defaultTestimonials);
  }, []);

  const handleAddSubmit = () => {
    if (!newCustomer.fullName.trim() || !newCustomer.phone.trim() || !newCustomer.password?.trim()) {
      toast.error("Please fill in Name, Phone, and Password.");
      return;
    }
    if (newCustomer.email.trim() && !newCustomer.email.trim().endsWith("@gmail.com")) {
      toast.error("Email must be a @gmail.com address.");
      return;
    }
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

  const openView = (index: number) => {
    setViewingCustomer(items[index]);
    setIsViewOpen(true);
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
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-semibold">Customers</h3>
                <p className="text-xs text-muted-foreground font-body">Manage customer testimonials.</p>
              </div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Customer
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Customer</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-xs font-body font-medium">Full Name*</label>
                      <input
                        required
                        value={newCustomer.fullName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-body font-medium">Email</label>
                      <input
                        type="email"
                        pattern=".+@gmail\.com"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="john@gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-body font-medium">Phone*</label>
                      <input
                        required
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-body font-medium">Password*</label>
                      <input
                        required
                        type="password"
                        value={newCustomer.password || ""}
                        onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-body font-medium">Address</label>
                      <textarea
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                        placeholder="Full Address"
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
                      Save Customer
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table className="table-fixed min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15%]">Full Name</TableHead>
                    <TableHead className="w-[20%]">Email</TableHead>
                    <TableHead className="w-[15%]">Phone</TableHead>
                    <TableHead className="w-[35%]">Address</TableHead>
                    <TableHead className="w-[15%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {it.fullName}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {it.email}
                        </span>
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
                            title={items.length <= 1 ? "At least one customer is required" : "Remove"}
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

              {/* View Dialog */}
              <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>View Customer</DialogTitle>
                  </DialogHeader>
                  {viewingCustomer && (
                    <div className="grid gap-4 py-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Full Name</p>
                        <p className="font-body text-sm font-medium">{viewingCustomer.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Email</p>
                        <p className="font-body text-sm">{viewingCustomer.email || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Phone</p>
                        <p className="font-body text-sm">{viewingCustomer.phone || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Address</p>
                        <p className="font-body text-sm whitespace-pre-wrap">{viewingCustomer.address || "—"}</p>
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

export default IndexAdmin;
