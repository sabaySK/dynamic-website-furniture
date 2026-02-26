import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

const featuredProducts = getProducts().filter((p) => p.featured).slice(0, 4);

const FeaturedProducts = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              Curated Selection
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Featured Pieces
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-1 text-sm font-body font-medium text-primary hover:underline underline-offset-4"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-sm font-body font-medium text-primary"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
