import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const COUPONS: Record<string, { discount: number; type: "percent" | "fixed" }> = {
  SAVE10: { discount: 10, type: "percent" },
  WELCOME20: { discount: 20, type: "percent" },
  FLAT50: { discount: 50, type: "fixed" },
};

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Delivery", desc: "5-7 business days", price: 0 },
  { id: "express", label: "Express Delivery", desc: "2-3 business days", price: 15 },
  { id: "pickup", label: "Store Pickup", desc: "Pick up at our showroom", price: 0 },
];

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
}

const PAYMENT_METHODS = [
  { id: "aba", label: "ABA" },
  { id: "acleda", label: "Acleda" },
  { id: "wing", label: "Wing" },
  { id: "card", label: "Credit Card" },
  { id: "cod", label: "Cash on Delivery" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("aba");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = totalPrice;
  const coupon = appliedCoupon ? COUPONS[appliedCoupon] : null;
  const discountAmount = coupon
    ? coupon.type === "percent"
      ? (subtotal * coupon.discount) / 100
      : Math.min(coupon.discount, subtotal)
    : 0;
  const deliveryPrice = DELIVERY_OPTIONS.find((d) => d.id === deliveryMethod)?.price ?? 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryPrice);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast.error("Enter a coupon code");
      return;
    }
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      toast.success(`Coupon "${code}" applied`);
    } else {
      setAppliedCoupon(null);
      toast.error("Invalid coupon code");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    setIsSubmitting(true);
    const orderId = `ORD-${Date.now()}`;
    const orderItems = items.map((i) => ({
      name: i.product.name,
      qty: i.quantity,
      price: i.product.price,
    }));
    const order: Order = {
      id: orderId,
      date: new Date().toISOString().split("T")[0],
      status: "processing",
      total: finalTotal,
      items: orderItems,
    };
    try {
      const stored = localStorage.getItem("account_orders");
      const existing: Order[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem("account_orders", JSON.stringify([order, ...existing]));
    } catch {}
    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      toast.success("Order placed successfully!");
      navigate("/");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-muted-foreground font-body text-sm">Add items to your cart before checkout.</p>
        <Button asChild>
          <Link to="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 lg:py-12 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <div className="mb-8">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
            <h1 className="font-display text-3xl font-semibold mt-4">Checkout</h1>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left column - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping address */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Street address, city, province"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="012 345 678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery method */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Delivery Method
                </h2>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="space-y-3">
                    {DELIVERY_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          deliveryMethod === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={opt.id} id={opt.id} />
                        <div className="flex-1">
                          <p className="font-body font-medium">{opt.label}</p>
                          <p className="text-sm text-muted-foreground">{opt.desc}</p>
                        </div>
                        {opt.price > 0 && (
                          <span className="font-body font-medium">+${opt.price.toFixed(2)}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Payment method */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          paymentMethod === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={opt.id} id={`pay-${opt.id}`} />
                        <span className="font-body font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Right column - Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-md shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium line-clamp-2">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-body text-sm font-semibold shrink-0">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="flex-1"
                  />
                  {appliedCoupon ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>
                      Remove
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" size="sm" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  )}
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedCoupon})</span>
                      <span>−${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {deliveryPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>+${deliveryPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border font-semibold">
                    <span>Total</span>
                    <span className="font-display text-xl">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing order..." : "Place Order"}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
