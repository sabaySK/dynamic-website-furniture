import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Truck, RotateCcw, ArrowUp, Search, X, SlidersHorizontal } from "lucide-react";
import { getProducts, getCategories } from "@/lib/catalog";
import type { Category, Material, Color } from "@/data/products";
import { materials, colors } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import shopBanner from "@/assets/shop-banner.jpg";
import { getOverride } from "@/lib/overrides";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SliderRange } from "@/components/ui/slider";

type AvailabilityFilter = "all" | "inStock" | "outStock";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") as Category | null;
  const [search, setSearch] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state from URL
  const priceMin = searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined;
  const priceMax = searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined;

  const priceBounds = useMemo(() => {
    const items = getProducts();
    if (items.length === 0) return { min: 0, max: 2000 };
    const prices = items.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices) / 50) * 50, max: Math.ceil(Math.max(...prices) / 50) * 50 };
  }, []);

  const priceRangeValue: [number, number] = [
    priceMin ?? priceBounds.min,
    priceMax ?? priceBounds.max,
  ];
  const materialsParam = searchParams.get("material")?.split(",").filter(Boolean) as Material[] | undefined;
  const colorsParam = searchParams.get("color")?.split(",").filter(Boolean) as Color[] | undefined;
  const availability = (searchParams.get("availability") as AvailabilityFilter) || "all";

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

    // Price range
    if (priceMin != null && !isNaN(priceMin)) {
      list = list.filter((p) => p.price >= priceMin);
    }
    if (priceMax != null && !isNaN(priceMax)) {
      list = list.filter((p) => p.price <= priceMax);
    }

    // Material
    if (materialsParam && materialsParam.length > 0) {
      list = list.filter((p) =>
        p.material?.some((m) => materialsParam.includes(m))
      );
    }

    // Color
    if (colorsParam && colorsParam.length > 0) {
      list = list.filter((p) => p.color && colorsParam.includes(p.color));
    }

    // Availability
    if (availability === "inStock") {
      list = list.filter((p) => p.inStock !== false);
    } else if (availability === "outStock") {
      list = list.filter((p) => p.inStock === false);
    }

    return list;
  }, [activeCategory, search, priceMin, priceMax, materialsParam, colorsParam, availability]);

  const setCategory = (cat: Category | null) => {
    if (cat) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("category", cat);
        return next;
      });
    } else {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("category");
        return next;
      });
    }
  };

  const updateFilters = (updates: Record<string, string | undefined>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      return next;
    });
  };

  const toggleMaterial = (m: Material) => {
    const current = materialsParam ?? [];
    const next = current.includes(m)
      ? current.filter((x) => x !== m)
      : [...current, m];
    updateFilters({ material: next.length > 0 ? next.join(",") : undefined });
  };

  const toggleColor = (c: Color) => {
    const current = colorsParam ?? [];
    const next = current.includes(c)
      ? current.filter((x) => x !== c)
      : [...current, c];
    updateFilters({ color: next.length > 0 ? next.join(",") : undefined });
  };

  const setPriceRange = (value: [number, number]) => {
    const [min, max] = value;
    if (min === priceBounds.min && max === priceBounds.max) {
      updateFilters({ priceMin: undefined, priceMax: undefined });
    } else {
      updateFilters({ priceMin: String(min), priceMax: String(max) });
    }
  };

  const clearFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("priceMin");
      next.delete("priceMax");
      next.delete("material");
      next.delete("color");
      next.delete("availability");
      return next;
    });
    setFilterOpen(false);
  };

  const hasActiveFilters =
    (priceMin != null && !isNaN(priceMin)) ||
    (priceMax != null && !isNaN(priceMax)) ||
    (materialsParam && materialsParam.length > 0) ||
    (colorsParam && colorsParam.length > 0) ||
    availability !== "all";

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
          {/* Categories + Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Filters button (mobile) / inline filters (desktop) */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-4 min-w-4 flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Price range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Price range</Label>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <span>${priceRangeValue[0]}</span>
                    <span>–</span>
                    <span>${priceRangeValue[1]}</span>
                  </div>
                  <SliderRange
                    value={priceRangeValue}
                    onValueChange={setPriceRange}
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={50}
                  />
                </div>

                {/* Material */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Material</Label>
                  <div className="flex flex-col gap-2">
                    {materials.map((m) => (
                      <div key={m} className="flex items-center space-x-2">
                        <Checkbox
                          id={`material-${m}`}
                          checked={materialsParam?.includes(m) ?? false}
                          onCheckedChange={() => toggleMaterial(m)}
                        />
                        <label
                          htmlFor={`material-${m}`}
                          className="text-sm font-body cursor-pointer"
                        >
                          {m}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color</Label>
                  <div className="flex flex-col gap-2">
                    {colors.map((c) => (
                      <div key={c} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${c}`}
                          checked={colorsParam?.includes(c) ?? false}
                          onCheckedChange={() => toggleColor(c)}
                        />
                        <label
                          htmlFor={`color-${c}`}
                          className="text-sm font-body cursor-pointer"
                        >
                          {c}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Availability</Label>
                  <select
                    value={availability}
                    onChange={(e) =>
                      updateFilters({
                        availability:
                          e.target.value === "all"
                            ? undefined
                            : e.target.value,
                      })
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="inStock">In Stock</option>
                    <option value="outStock">Out of Stock</option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Categories */}
          {/* Mobile: horizontally scrollable row; Desktop: wrapping row */}
          <div className="relative -mx-4 lg:mx-0 flex-1 min-w-0">
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
          </div>

          {/* Product count */}
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
        </div>
        </div>
        </div>

        {/* Desktop filter sidebar + Products */}
        <div className="flex gap-8 mt-6">
          {/* Desktop filters - visible on lg+ */}
          <aside className="hidden lg:block w-56 shrink-0 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Price range</Label>
                <div className="flex gap-2 items-center text-sm text-muted-foreground mb-2">
                  <span>${priceRangeValue[0]}</span>
                  <span>–</span>
                  <span>${priceRangeValue[1]}</span>
                </div>
                <SliderRange
                  value={priceRangeValue}
                  onValueChange={setPriceRange}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={50}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Material</Label>
                <div className="flex flex-col gap-2">
                  {materials.map((m) => (
                    <div key={m} className="flex items-center space-x-2">
                      <Checkbox
                        id={`desktop-material-${m}`}
                        checked={materialsParam?.includes(m) ?? false}
                        onCheckedChange={() => toggleMaterial(m)}
                      />
                      <label htmlFor={`desktop-material-${m}`} className="text-sm font-body cursor-pointer">
                        {m}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color</Label>
                <div className="flex flex-col gap-2">
                  {colors.map((c) => (
                    <div key={c} className="flex items-center space-x-2">
                      <Checkbox
                        id={`desktop-color-${c}`}
                        checked={colorsParam?.includes(c) ?? false}
                        onCheckedChange={() => toggleColor(c)}
                      />
                      <label htmlFor={`desktop-color-${c}`} className="text-sm font-body cursor-pointer">
                        {c}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Availability</Label>
                <select
                  value={availability}
                  onChange={(e) =>
                    updateFilters({
                      availability: e.target.value === "all" ? undefined : e.target.value,
                    })
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">All</option>
                  <option value="inStock">In Stock</option>
                  <option value="outStock">Out of Stock</option>
                </select>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          </aside>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body">
                {search ? `No products match "${search}".` : "No products found with these filters."}
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
          )}
        </div>
        </div>
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
