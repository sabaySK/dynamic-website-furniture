import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  ChevronRight,
  Plus,
  Trash2,
  Pencil,
  FileText,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { getProducts } from "@/lib/catalog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

const STORAGE_PROFILE = "account_profile";
const STORAGE_ADDRESSES = "account_addresses";
const STORAGE_ORDERS = "account_orders";

type TabId = "profile" | "orders" | "wishlist" | "addresses" | "password" | "policies";

interface Profile {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

const STATIC_PROFILE: Profile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "012 345 678",
  address: "123 Main Street, Phnom Penh, Cambodia",
};

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  phone: string;
}

type OrderStatus = "ordered" | "processing" | "shipped" | "delivered";

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { name: string; qty: number; price: number }[];
}

const STATIC_ORDERS: Order[] = [
  {
    id: "ORD-001",
    date: "2026-03-01",
    status: "delivered",
    total: 1299,
    items: [
      { name: "Nordic Linen Sofa", qty: 1, price: 1299 },
    ],
  },
  {
    id: "ORD-002",
    date: "2026-03-03",
    status: "shipped",
    total: 1348,
    items: [
      { name: "Lounge Armchair", qty: 1, price: 749 },
      { name: "Round Coffee Table", qty: 1, price: 449 },
    ],
  },
  {
    id: "ORD-003",
    date: "2026-03-05",
    status: "processing",
    total: 599,
    items: [
      { name: "Writing Desk", qty: 1, price: 599 },
    ],
  },
];

const STATIC_WISHLIST_IDS = ["1", "2", "5"]; // Nordic Linen Sofa, Artisan Dining Table, Lounge Armchair

const POLICIES_LINKS = [
  { label: "Shipping Policy", to: "/shipping-policy" },
  { label: "Return Policy", to: "/return-policy" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms" },
];

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "password", label: "Password Settings", icon: Lock },
  { id: "policies", label: "Policies", icon: FileText },
];

const Account = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get("tab") as TabId) || "profile";
  const setTab = (t: TabId) => setSearchParams({ tab: t });

  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlist();

  const [profile, setProfile] = useState<Profile>(STATIC_PROFILE);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem(STORAGE_PROFILE);
      if (p) {
        try {
          const parsed = JSON.parse(p);
          if (parsed && (parsed.name || parsed.email || parsed.phone)) {
            setProfile(parsed);
          }
        } catch {}
      }
      const a = localStorage.getItem(STORAGE_ADDRESSES);
      if (a) setAddresses(JSON.parse(a));
      const o = localStorage.getItem(STORAGE_ORDERS);
      if (o) {
        const parsed = JSON.parse(o);
        const stored = Array.isArray(parsed) ? parsed : [];
        setOrders(stored.length > 0 ? [...stored, ...STATIC_ORDERS] : STATIC_ORDERS);
      } else {
        setOrders(STATIC_ORDERS);
      }
    } catch {
      setOrders(STATIC_ORDERS);
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
    setIsEditingProfile(false);
    toast.success("Profile updated");
  };

  const addAddress = (label: string, address: string, phone: string) => {
    const newAddr: SavedAddress = {
      id: String(Date.now()),
      label,
      address,
      phone,
    };
    const next = [...addresses, newAddr];
    setAddresses(next);
    localStorage.setItem(STORAGE_ADDRESSES, JSON.stringify(next));
    toast.success("Address added");
  };

  const removeAddress = (id: string) => {
    const next = addresses.filter((a) => a.id !== id);
    setAddresses(next);
    localStorage.setItem(STORAGE_ADDRESSES, JSON.stringify(next));
    toast.success("Address removed");
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    toast.success("Password updated successfully");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  const handleForgotPassword = () => {
    if (!otpEmail.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent to your email");
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 w-full px-4 py-8 lg:py-12 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="font-display text-3xl font-semibold mb-8">My Account</h1>

          <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <nav className="lg:w-56 shrink-0">
            <ul className="space-y-1">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-body text-sm transition-colors ${
                      tab === t.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 bg-card rounded-xl border border-border p-6 lg:p-8">
            {tab === "profile" && (
              <div className="space-y-8 w-full">
                {/* Profile header with avatar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-border">
                  <Avatar className="h-20 w-20 rounded-full border-2 border-primary/20 bg-primary/10">
                    <AvatarFallback className="text-xl font-display font-semibold text-primary">
                      {profile.name
                        ? profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-2xl font-semibold tracking-tight">
                      {profile.name || "Profile"}
                    </h2>
                    <p className="text-muted-foreground font-body text-sm mt-0.5">
                      {profile.email || "—"}
                    </p>
                    {!isEditingProfile ? (
                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        className="mt-4 gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveProfile}>Save Changes</Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile info */}
                <div className="w-full">
                  <h3 className="font-display text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Personal Information
                  </h3>
                  {isEditingProfile ? (
                    <div className="grid sm:grid-cols-2 gap-5 w-full">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Full Name</Label>
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Your name"
                          className="h-11 w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Email</Label>
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                          placeholder="you@example.com"
                          className="h-11 w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Phone</Label>
                        <Input
                          value={profile.phone}
                          onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                          placeholder="012 345 678"
                          className="h-11 w-full"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-muted-foreground">Address</Label>
                        <Input
                          value={profile.address ?? ""}
                          onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                          placeholder="Your address"
                          className="h-11 w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4 w-full">
                      <div className="rounded-lg bg-muted/50 px-4 py-3 border border-border/50">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Full Name
                        </p>
                        <p className="font-body font-medium">{profile.name || "—"}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 px-4 py-3 border border-border/50">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Email
                        </p>
                        <p className="font-body font-medium break-all">{profile.email || "—"}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 px-4 py-3 border border-border/50">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Phone
                        </p>
                        <p className="font-body font-medium">{profile.phone || "—"}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 px-4 py-3 border border-border/50 sm:col-span-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Address
                        </p>
                        <p className="font-body font-medium">{profile.address || "—"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-semibold">My Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground font-body">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors"
                      >
                        <div>
                          <p className="font-display font-medium">Order #{o.id}</p>
                          <p className="text-sm text-muted-foreground">{o.date}</p>
                          <p className="text-sm mt-1">
                            <span className="capitalize">{o.status}</span> · ${o.total.toFixed(2)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/account/orders/${o.id}`}>View Detail</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "wishlist" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-semibold">Wishlist</h2>
                {(() => {
                  const allProducts = getProducts();
                  const displayItems =
                    wishlistItems.length > 0
                      ? wishlistItems
                      : STATIC_WISHLIST_IDS.map((id) => allProducts.find((p) => p.id === id)).filter(
                          (p): p is NonNullable<typeof p> => p != null
                        );
                  const isStatic = wishlistItems.length === 0 && displayItems.length > 0;
                  return displayItems.length === 0 ? (
                    <p className="text-muted-foreground font-body">
                      Your wishlist is empty.{" "}
                      <Link to="/shop" className="text-primary hover:underline">
                        Browse products
                      </Link>
                    </p>
                  ) : (
                    <>
                      {isStatic && (
                        <p className="text-muted-foreground font-body text-sm">
                          Suggested for you.{" "}
                          <Link to="/shop" className="text-primary hover:underline">
                            Browse more products
                          </Link>
                        </p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayItems.map((product, i) => (
                          <div key={product.id} className="relative">
                            <ProductCard product={product} index={i} />
                            {!isStatic && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeWishlistItem(product.id)}
                                aria-label="Remove from wishlist"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {tab === "addresses" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-semibold">Saved Addresses</h2>
                {profile.name && (
                  <p className="text-sm text-muted-foreground font-body">
                    Addresses for {profile.name}
                  </p>
                )}
                <div className="space-y-4">
                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      className="border border-border rounded-lg p-4 flex justify-between items-start gap-4"
                    >
                      <div>
                        <p className="font-display font-medium">{a.label}</p>
                        <p className="text-sm text-muted-foreground">{a.address}</p>
                        <p className="text-sm text-muted-foreground">{a.phone}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeAddress(a.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <AddAddressForm onAdd={addAddress} />
              </div>
            )}

            {tab === "password" && (
              <div className="space-y-8 w-full">
                <div>
                  <h2 className="font-display text-xl font-semibold mb-4">Change Password</h2>
                  <div className="space-y-4 w-full">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full"
                      />
                    </div>
                    <Button onClick={handleChangePassword} className="w-full">
                      Update Password
                    </Button>
                  </div>
                </div>
                <div className="border-t border-border pt-6 w-full">
                  <h2 className="font-display text-xl font-semibold mb-4">Forgot Password</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter your email to receive an OTP to reset your password.
                  </p>
                  <div className="flex gap-2 w-full">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      disabled={otpSent}
                      className="flex-1 min-w-0"
                    />
                    <Button variant="outline" onClick={handleForgotPassword} disabled={otpSent} className="shrink-0">
                      {otpSent ? "OTP Sent" : "Send OTP"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {tab === "policies" && (
              <div className="space-y-6 w-full">
                <h2 className="font-display text-xl font-semibold">Policies</h2>
                <p className="text-muted-foreground font-body text-sm">
                  Review our policies for shipping, returns, privacy, and terms of service.
                </p>
                <div className="space-y-2">
                  {POLICIES_LINKS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors group"
                    >
                      <span className="font-body font-medium">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function AddAddressForm({
  onAdd,
}: {
  onAdd: (label: string, address: string, phone: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !address.trim() || !phone.trim()) return;
    onAdd(label, address, phone);
    setLabel("");
    setAddress("");
    setPhone("");
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(!open)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Address
      </Button>
      {open && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border border-border rounded-lg space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Label (e.g. Home, Office)</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Home" required />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, province" required />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="012 345 678" required />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Account;
