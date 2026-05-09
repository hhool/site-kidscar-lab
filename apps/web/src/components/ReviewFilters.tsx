"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAppLang } from "./useAppLang";
import {
  REVIEW_CATEGORIES,
  REVIEW_AGE_GROUPS,
  REVIEW_PRICE_RANGES,
  REVIEW_SORT_OPTIONS,
  type ReviewCategory,
  type ReviewAgeGroup,
  type ReviewPriceRange,
  type ReviewSortBy,
} from "@/lib/reviews-data";

export function ReviewFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isZh } = useAppLang();

  const currentCategory = (searchParams.get("category") as ReviewCategory) || "";
  const currentAge = (searchParams.get("age") as ReviewAgeGroup) || "";
  const currentPrice = (searchParams.get("price") as ReviewPriceRange) || "";
  const currentSort = (searchParams.get("sort") as ReviewSortBy) || "latest";

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

  const hasActiveFilters = currentCategory || currentAge || currentPrice;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900">
          {isZh ? "🔍 筛选条件" : "🔍 Filter"}
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
          >
            {isZh ? "清除全部" : "Clear All"}
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-zinc-900">
          {isZh ? "品类" : "Category"}
        </label>
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
          {(Object.entries(REVIEW_CATEGORIES) as [ReviewCategory, { zh: string; en: string }][]).map(
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

      {/* Age Group Filter */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-zinc-900">
          {isZh ? "年龄段" : "Age Group"}
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("age", "")}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              !currentAge
                ? "bg-blue-600 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-blue-300"
            }`}
          >
            {isZh ? "全部" : "All"}
          </button>
          {(Object.entries(REVIEW_AGE_GROUPS) as [ReviewAgeGroup, { zh: string; en: string }][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => updateFilter("age", key)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  currentAge === key
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

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-zinc-900">
          {isZh ? "价格范围" : "Price Range"}
        </label>
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
          {(Object.entries(REVIEW_PRICE_RANGES) as [ReviewPriceRange, { zh: string; en: string }][]).map(
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
                {label.zh || label.en}
              </button>
            )
          )}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-900">
          {isZh ? "排序" : "Sort By"}
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(REVIEW_SORT_OPTIONS) as [ReviewSortBy, { zh: string; en: string }][]).map(
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
