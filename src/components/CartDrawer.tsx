import { X, Plus, Minus, Send, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";


const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();

  const generateTelegramLink = () => {
    const message = items
      .map(
        (item) =>
          `${item.product.name} (x${item.quantity}) - $${(
            item.product.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");
    const fullMessage = `ខ្ញុំសុំសួរព័ត៌មានខ្លះបានទេបង?\n\nខ្ញុំចាប់អារម្មណ៍នឹងទំនិញខាងក្រោម៖\n\n${message}\n\nTotal: $${totalPrice.toFixed(
      2
    )}`;
    return `https://t.me/TepSarak_dev?text=${encodeURIComponent(fullMessage)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl font-semibold">Your Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground font-body text-sm">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 text-primary font-body text-sm underline underline-offset-4 hover:text-primary/80 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 p-3 rounded-lg bg-card"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm font-medium truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-primary font-body text-sm font-semibold mt-1">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-body font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1 self-start text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-xl font-semibold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <a
                  href={generateTelegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-body font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Contact via Telegram
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
