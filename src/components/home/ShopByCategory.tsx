import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/data/products";
import productSofa from "@/assets/product-sofa.jpg";
import productBed from "@/assets/product-bed.jpg";
import productDining from "@/assets/product-dining.jpg";
import productLamp from "@/assets/product-lamp.jpg";
import productShelf from "@/assets/product-shelf.jpg";
import productChair from "@/assets/product-chair.jpg";
import type { Category } from "@/data/products";

const categoryImages: Record<Category, string> = {
  "Living Room": productSofa,
  Bedroom: productBed,
  Dining: productDining,
  Office: productChair,
  Lighting: productLamp,
  Storage: productShelf,
};

const ShopByCategory = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
            Explore
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="group block overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={categoryImages[category]}
                    alt={category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/30 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <span className="font-display text-lg font-semibold text-primary-foreground drop-shadow-sm">
                      {category}
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/90 font-body opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
