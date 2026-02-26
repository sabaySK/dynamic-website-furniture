import { products as defaultProducts, type Product, type Category, categories as defaultCategories } from "@/data/products";
import { getOverride, setOverride } from "./overrides";

const PRODUCTS_KEY = "data.products";

export function getProducts(): Product[] {
  const raw = getOverride(PRODUCTS_KEY, "");
  if (!raw) return defaultProducts;
  try {
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed)) return defaultProducts;
    return parsed;
  } catch {
    return defaultProducts;
  }
}

export function saveProducts(next: Product[]) {
  setOverride(PRODUCTS_KEY, JSON.stringify(next));
}

export function getCategories(): Category[] {
  const items = getProducts();
  const set = new Set<Category>();
  for (const p of items) set.add(p.category);
  const arr = Array.from(set);
  return arr.length ? arr : defaultCategories;
}
