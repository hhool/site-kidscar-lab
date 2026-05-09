"use client";

import { useSearchParams } from "next/navigation";
import { ReviewCard } from "./ReviewCard";
import { useAppLang } from "./useAppLang";
import { mockReviews, filterReviews, type ReviewCategory, type ReviewAgeGroup, type ReviewPriceRange, type ReviewSortBy } from "@/lib/reviews-data";

export function ReviewsList() {
  const searchParams = useSearchParams();
  const { isZh } = useAppLang();

  const category = (searchParams.get("category") as ReviewCategory) || undefined;
  const age = (searchParams.get("age") as ReviewAgeGroup) || undefined;
  const price = (searchParams.get("price") as ReviewPriceRange) || undefined;
  const sort = (searchParams.get("sort") as ReviewSortBy) || "latest";

  const filteredReviews = filterReviews(mockReviews, {
    category,
    ageGroup: age,
    priceRange: price,
    sortBy: sort,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900">
          {isZh ? "评测列表" : "Reviews"} ({filteredReviews.length})
        </h2>
      </div>

      {filteredReviews.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center">
          <p className="text-lg font-semibold text-zinc-600">
            {isZh ? "未找到匹配的评测" : "No matching reviews found"}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {isZh
              ? "尝试调整筛选条件，查看更多评测"
              : "Try adjusting your filters to see more reviews"}
          </p>
        </div>
      )}
    </div>
  );
}
