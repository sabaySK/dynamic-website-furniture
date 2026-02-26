import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Truck, RotateCcw, ArrowUp, Search, X } from "lucide-react";
import { getProducts, getCategories } from "@/lib/catalog";
import type { Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import shopBanner from "@/assets/shop-banner.jpg";
import { getOverride } from "@/lib/overrides";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "newest";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") as Category | null;
  const [sort, setSort] = useState<SortOption>("default");
  const [search, setSearch] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = useMemo(() => {
    const items = getProducts();
    let list = activeCategory
      ? items.filter((p) => p.category === activeCategory)
      : [...items];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
    return list;
  }, [activeCategory, sort, search]);

  const setCategory = (cat: Category | null) => {
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen">
      {/* Banner Header */}
      <section className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <img
          src={getOverride("shop.banner.image", shopBanner)}
          alt="Nord Furniture collection showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              {getOverride("shop.banner.preTitle", "Browse Our Collection")}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold">
              {getOverride("shop.banner.title", "The Shop")}
            </h1>
            <p className="text-muted-foreground font-body text-sm max-w-md mx-auto mt-4">
              {getOverride(
                "shop.banner.subtitle",
                "Every piece is handcrafted from sustainably sourced materials with a 5-year warranty."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust micro-bar */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 py-3">
            {[
              { icon: Truck, text: "Free Shipping $500+" },
              { icon: Shield, text: "5 Year Warranty" },
              { icon: RotateCcw, text: "30 Day Returns" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                <item.icon className="h-3.5 w-3.5 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10">
        {/* Filters */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm -mx-4 px-4 lg:-mx-8 lg:px-8 py-4 -mt-4 border-b border-border/50">
        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-9 py-2 rounded-full text-sm font-body bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4">
          {/* Categories */}
          {/* Mobile: horizontally scrollable row; Desktop: wrapping row */}
          <div className="relative -mx-4 lg:mx-0 w-full lg:w-auto">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 lg:px-0 pb-1 lg:flex-wrap lg:overflow-visible snap-x snap-mandatory lg:snap-none touch-pan-x">
              <button
                onClick={() => setCategory(null)}
                className={`snap-start shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-colors whitespace-nowrap ${
                  !activeCategory
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {getCategories().map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`snap-start shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-colors whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-foreground text-background"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
              {/* Spacer so last item isn't flush with fade */}
              <span className="shrink-0 w-4 lg:hidden" aria-hidden="true" />
            </div>
            {/* Right-edge fade hint on mobile & tablet */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-12 bg-gradient-to-l from-background to-transparent lg:hidden" />
          </div>

          {/* Sort + Count */}
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={filtered.length}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground font-body"
              >
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </motion.span>
            </AnimatePresence>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-body text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
        </div>
        </div>
        </div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">
              {search ? `No products match "${search}".` : "No products found in this category."}
            </p>
          </div>
        )}
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
