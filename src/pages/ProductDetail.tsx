import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Minus, Plus, ArrowLeft, Truck, RotateCcw, Shield, Send } from "lucide-react";
import { getProducts } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const allProducts = getProducts();
  const product = allProducts.find((p) => p.id === id);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  // If no related in same category, show other featured
  const displayRelated = useMemo(() => {
    if (relatedProducts.length >= 2) return relatedProducts;
    const extra = allProducts
      .filter((p) => p.id !== product?.id && !relatedProducts.find((r) => r.id === p.id))
      .slice(0, 4 - relatedProducts.length);
    return [...relatedProducts, ...extra];
  }, [relatedProducts, product, allProducts]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-2xl font-semibold">Product not found</h1>
        <Link to="/shop" className="text-primary font-body text-sm underline underline-offset-4">
          Back to Shop
        </Link>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setQuantity(1);
  };

  const handleTelegramContact = async () => {
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const message = `ខ្ញុំសុំសួរព័ត៌មានខ្លះបានទេបង?\n\nខ្ញុំចាប់អារម្មណ៍នឹងទំនិញខាងក្រោម៖\n\n${product.name}\nPrice: $${product.price.toFixed(2)}\nLink: ${productUrl}`;

    let copied = false;

    try {
      await navigator.clipboard.writeText(message);
      copied = true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = message;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      document.body.removeChild(textarea);
    }

    if (!copied) {
      window.prompt("Copy message to send on Telegram:", message);
      toast.message("Copy the message, then paste into Telegram.");
    } else {
      toast.success("Message copied. Paste it in Telegram.");
    }

    window.open("https://t.me/TepSarak_dev", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm font-body text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <span>/</span>
          <Link
            to={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square overflow-hidden rounded-xl bg-card"
            >
              <img
                src={gallery[selectedImageIndex]}
                alt={`${product.name} - view ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImageIndex
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badges */}
              <div className="flex gap-2 mb-3">
                {product.isNew && (
                  <span className="bg-secondary text-secondary-foreground text-xs font-body font-semibold px-3 py-1 rounded-full">
                    New Arrival
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-primary text-primary-foreground text-xs font-body font-semibold px-3 py-1 rounded-full">
                    {discount}% Off
                  </span>
                )}
              </div>

              {/* Category */}
              <p className="text-xs text-muted-foreground font-body uppercase tracking-[0.15em] mb-2">
                {product.category}
              </p>

              {/* Name */}
              <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-accent text-accent"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-body text-muted-foreground">
                  {product.rating} · {product.reviews || 0} reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-3xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="font-body text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                {product.longDescription || product.description}
              </p>

              {/* Quantity + Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-5 font-body font-medium text-sm min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-8 rounded-lg font-body font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleTelegramContact}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-8 rounded-lg font-body font-medium text-sm hover:bg-blue-600 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Contact via Telegram
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-xs font-body text-muted-foreground">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span className="text-xs font-body text-muted-foreground">30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-xs font-body text-muted-foreground">5-Year Warranty</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Specifications */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="font-display text-2xl font-semibold mb-6">Specifications</h2>
            <div className="bg-card rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <tr
                      key={key}
                      className={i % 2 === 0 ? "" : "bg-muted/30"}
                    >
                      <td className="px-6 py-3.5 font-body text-sm font-medium text-foreground w-1/3">
                        {key}
                      </td>
                      <td className="px-6 py-3.5 font-body text-sm text-muted-foreground">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </section>

      {/* Related Products */}
      {displayRelated.length > 0 && (
        <section className="bg-card py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
                  You May Also Like
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-semibold">
                  Related Products
                </h2>
              </div>
              <Link
                to="/shop"
                className="hidden md:block text-sm font-body font-medium text-primary hover:underline underline-offset-4"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayRelated.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
