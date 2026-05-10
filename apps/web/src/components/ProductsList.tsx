"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { usePhase3Content } from "./usePhase3Content";
import { useAppLang } from "./useAppLang";
import {
  filterProducts,
  type ProductCategory,
  type ProductPriceRange,
  type ProductSortBy,
} from "@/lib/products-data";

export function ProductsList() {
  const searchParams = useSearchParams();
  const { isZh } = useAppLang();
  const content = usePhase3Content();

  const category = (searchParams.get("category") as ProductCategory) || undefined;
  const priceRange = (searchParams.get("price") as ProductPriceRange) || undefined;
  const query = searchParams.get("q") || undefined;
  const sortBy = (searchParams.get("sort") as ProductSortBy) || "featured";

  const filteredProducts = filterProducts(content.products, {
    category,
    priceRange,
    query,
    sortBy,
  });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900">
          {isZh ? "产品列表" : "Products"} ({filteredProducts.length})
        </h2>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center">
          <p className="text-lg font-semibold text-zinc-600">{isZh ? "未找到匹配产品" : "No matching products found"}</p>
          <p className="mt-2 text-sm text-zinc-500">
            {isZh ? "尝试调整筛选或搜索关键词" : "Try adjusting filters or search keywords"}
          </p>
        </div>
      )}
    </section>
  );
}
