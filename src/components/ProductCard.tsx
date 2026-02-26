import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card rounded-xl overflow-hidden"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && (
            <span className="bg-secondary text-secondary-foreground text-xs font-body font-semibold px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {discountPercent && (
            <span className="bg-primary text-primary-foreground text-xs font-body font-semibold px-2.5 py-1 rounded-full">
              −{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick add */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product);
          }}
          className="absolute bottom-3 right-3 bg-foreground text-background p-2.5 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-base font-medium text-foreground mb-2 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-body text-muted-foreground">
            {product.rating}
            {product.reviews && <span className="ml-1">({product.reviews})</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-body font-semibold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="font-body text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
