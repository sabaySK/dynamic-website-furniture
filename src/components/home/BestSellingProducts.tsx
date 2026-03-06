import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/catalog";
import { products as defaultProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const getBestSellingProducts = () => {
  const all = getProducts();
  const source = all.length > 0 ? all : defaultProducts;
  return [...source].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4);
};

const BestSellingProducts = () => {
  const products = getBestSellingProducts();
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              Top Picks
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Best Selling Products
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
          {products.map((product, i) => (
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

export default BestSellingProducts;
