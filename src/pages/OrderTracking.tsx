import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_ORDERS = "account_orders";

type OrderStatus = "ordered" | "processing" | "shipped" | "delivered";

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { name: string; qty: number; price: number }[];
}

const ORDER_STEPS: { key: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
  { key: "ordered", label: "Order Placed", desc: "We've received your order", icon: ShoppingBag },
  { key: "processing", label: "Processing", desc: "Preparing your items", icon: Package },
  { key: "shipped", label: "Shipped", desc: "On its way to you", icon: Truck },
  { key: "delivered", label: "Delivered", desc: "Order completed", icon: MapPin },
];

const STATIC_ORDERS: Order[] = [
  {
    id: "ORD-001",
    date: "2026-03-01",
    status: "delivered",
    total: 1299,
    items: [{ name: "Nordic Linen Sofa", qty: 1, price: 1299 }],
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
    items: [{ name: "Writing Desk", qty: 1, price: 599 }],
  },
];

function getOrders(): Order[] {
  try {
    const o = localStorage.getItem(STORAGE_ORDERS);
    if (o) {
      const parsed = JSON.parse(o);
      const stored = Array.isArray(parsed) ? parsed : [];
      return stored.length > 0 ? [...stored, ...STATIC_ORDERS] : STATIC_ORDERS;
    }
  } catch { }
  return STATIC_ORDERS;
}

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <p className="font-body text-muted-foreground">Order not found</p>
        <Button asChild variant="outline">
          <Link to="/account?tab=orders" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>
        </Button>
      </div>
    );
  }

  const validStatus = ORDER_STEPS.some((s) => s.key === order.status)
    ? order.status
    : ("ordered" as OrderStatus);
  const stepIndex = Math.max(0, ORDER_STEPS.findIndex((s) => s.key === validStatus));

  const formatDate = (d: string) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-3xl mx-auto px-4 py-8 lg:py-12">
        {/* Back link */}
        <Link
          to="/account?tab=orders"
          className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              Order #{order.id}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground font-body text-sm">
            <Calendar className="h-4 w-4" />
            {formatDate(order.date)}
          </div>
        </motion.div>

        {/* Process timeline - Horizontal Steps */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-6 sm:p-10 mb-8 shadow-sm overflow-hidden"
        >
          <div className="flex flex-col items-center mb-10">
            <h2 className="font-display text-xl font-semibold mb-1">Order Progress</h2>
            <p className="text-sm text-muted-foreground font-body">Follow your furniture's journey</p>
          </div>

          <div className="relative">
            {/* Progress Track Background */}
            <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-muted hidden sm:block" />

            {/* Active Progress Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stepIndex / (ORDER_STEPS.length - 1)) * 75}%` }}
              transition={{ duration: 1, ease: "circOut", delay: 0.5 }}
              className="absolute top-5 left-[12.5%] h-0.5 bg-primary hidden sm:block"
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-0 relative z-10">
              {ORDER_STEPS.map((step, i) => {
                const isCompleted = i < stepIndex;
                const isCurrent = i === stepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex flex-row sm:flex-col items-center text-left sm:text-center group">
                    <div className="relative sm:mb-4">
                      {/* Circle indicator */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 shadow-sm ${isCompleted
                            ? "border-primary bg-primary text-primary-foreground shadow-primary/20"
                            : isCurrent
                              ? "border-primary bg-background text-primary ring-4 ring-primary/10"
                              : "border-muted bg-muted/30 text-muted-foreground"
                          }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </motion.div>

                      {/* Mobile connecting line */}
                      {i < ORDER_STEPS.length - 1 && (
                        <div className="absolute left-5 top-10 w-px h-8 bg-border sm:hidden" />
                      )}
                    </div>

                    <div className="ml-4 sm:ml-0 px-2">
                      <p
                        className={`font-display text-sm font-semibold transition-colors duration-300 ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                          }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] leading-tight text-muted-foreground font-body mt-0.5 max-w-[120px] sm:mx-auto">
                        {step.desc}
                      </p>

                      {isCurrent && (
                        <motion.div
                          layoutId="active-dot"
                          className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mx-auto hidden sm:block"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Order items */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm"
        >
          <h2 className="font-display text-lg font-semibold mb-6">Order Items</h2>
          <ul className="space-y-4">
            {order.items.map((item, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-3 border-b border-border last:border-0 last:pb-0 first:pt-0"
              >
                <div>
                  <p className="font-body font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.qty} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-display font-semibold">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-6 border-t-2 border-border flex justify-between items-center">
            <span className="font-display text-lg font-semibold">Total</span>
            <span className="font-display text-xl font-semibold text-primary">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8"
        >
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/account?tab=orders" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to My Orders
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;
