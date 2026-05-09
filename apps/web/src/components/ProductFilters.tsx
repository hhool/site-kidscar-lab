"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAppLang } from "./useAppLang";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SORT_OPTIONS,
  type ProductCategory,
  type ProductPriceRange,
  type ProductSortBy,
} from "@/lib/products-data";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isZh } = useAppLang();

  const currentCategory = (searchParams.get("category") as ProductCategory) || "";
  const currentPrice = (searchParams.get("price") as ProductPriceRange) || "";
  const currentSort = (searchParams.get("sort") as ProductSortBy) || "featured";
  const currentQuery = searchParams.get("q") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.replace("");
  };

  const hasActiveFilters = currentCategory || currentPrice || currentQuery;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900">{isZh ? "🛒 产品筛选" : "🛒 Product Filters"}</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 underline hover:text-blue-700"
          >
            {isZh ? "清除全部" : "Clear All"}
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-zinc-900">{isZh ? "搜索" : "Search"}</label>
        <input
          value={currentQuery}
          onChange={(event) => updateFilter("q", event.target.value)}
          placeholder={isZh ? "搜索产品名或关键词" : "Search by product name or keyword"}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-blue-400"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-zinc-900">{isZh ? "品类" : "Category"}</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("category", "")}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              !currentCategory
                ? "bg-blue-600 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-blue-300"
            }`}
          >
            {isZh ? "全部" : "All"}
          </button>
          {(Object.entries(PRODUCT_CATEGORIES) as [ProductCategory, { zh: string; en: string }][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => updateFilter("category", key)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  currentCategory === key
                    ? "bg-blue-600 text-white"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-blue-300"
                }`}
              >
                {isZh ? label.zh : label.en}
              </button>
            )
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-zinc-900">{isZh ? "价格范围" : "Price Range"}</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("price", "")}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              !currentPrice
                ? "bg-blue-600 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-blue-300"
            }`}
          >
            {isZh ? "全部" : "All"}
          </button>
          {(Object.entries(PRODUCT_PRICE_RANGES) as [ProductPriceRange, { zh: string; en: string }][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => updateFilter("price", key)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  currentPrice === key
                    ? "bg-blue-600 text-white"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-blue-300"
                }`}
              >
                {isZh ? label.zh : label.en}
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-900">{isZh ? "排序" : "Sort By"}</label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(PRODUCT_SORT_OPTIONS) as [ProductSortBy, { zh: string; en: string }][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => updateFilter("sort", key)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  currentSort === key
                    ? "bg-green-600 text-white"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-green-300"
                }`}
              >
                {isZh ? label.zh : label.en}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
