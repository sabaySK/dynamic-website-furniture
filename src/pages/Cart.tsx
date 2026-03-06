import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const COUPONS: Record<string, { discount: number; type: "percent" | "fixed" }> = {
  SAVE10: { discount: 10, type: "percent" },
  WELCOME20: { discount: 20, type: "percent" },
  FLAT50: { discount: 50, type: "fixed" },
};

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = totalPrice;
  const coupon = appliedCoupon ? COUPONS[appliedCoupon] : null;
  const discountAmount = coupon
    ? coupon.type === "percent"
      ? (subtotal * coupon.discount) / 100
      : Math.min(coupon.discount, subtotal)
    : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

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

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-semibold">Your Cart</h1>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground font-body text-lg mb-6">
                Your cart is empty
              </p>
              <Button asChild variant="outline">
                <Link to="/shop">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 rounded-lg bg-card border border-border"
                  >
                    <Link
                      to={`/product/${item.product.id}`}
                      className="shrink-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-display text-base font-medium hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-muted-foreground font-body text-sm mt-1">
                        ${item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                      <p className="text-primary font-body text-sm font-semibold mt-0.5">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-body font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.product.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                {/* Apply coupon */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="pl-9"
                      disabled={!!appliedCoupon}
                    />
                  </div>
                  {appliedCoupon ? (
                    <Button variant="outline" onClick={handleRemoveCoupon}>
                      Remove
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  )}
                </div>

                {/* Order summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-body text-muted-foreground">Subtotal</span>
                    <span className="font-body">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span className="font-body">Discount ({appliedCoupon})</span>
                      <span className="font-body">−${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-body font-medium">Total</span>
                    <span className="font-display text-2xl font-semibold">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button asChild className="w-full mt-4">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
