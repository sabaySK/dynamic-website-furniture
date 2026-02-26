import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const newProducts = products.filter((p) => p.isNew).slice(0, 3);

const NewArrivals = () => {
  if (newProducts.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
            Just Arrived
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            New This Season
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {newProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
