"use client";

import Link from "next/link";
import { Review } from "@/lib/reviews-data";
import { useAppLang } from "./useAppLang";
import { ROUTES } from "@/lib/constants/routes";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { isZh } = useAppLang();

  const title = isZh ? review.title.zh : review.title.en;
  const summary = isZh ? review.summary.zh : review.summary.en;

  return (
    <Link
      href={`${ROUTES.reviews}/${review.id}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-lg"
    >
      {/* Header with score */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="flex-1 pr-3 font-semibold text-zinc-900 group-hover:text-blue-600">
          {title}
        </h3>
        <div className="flex flex-col items-end">
          <span className="inline-block rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 font-bold text-orange-700">
            {review.overallScore.toFixed(1)}
          </span>
          <span className="mt-1 text-xs text-zinc-500">/10</span>
        </div>
      </div>

      {/* Category & Version badges */}
      <div className="mb-3 flex flex-wrap gap-2">
        {review.featured && (
          <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            ★ Featured
          </span>
        )}
        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {review.reviewVersion}
        </span>
      </div>

      {/* Summary */}
      <p className="mb-4 line-clamp-2 text-sm text-zinc-600">{summary}</p>

      {/* Score breakdown */}
      <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-600">{isZh ? "安全性" : "Safety"}</div>
          <div className="font-bold text-zinc-900">{review.safetyScore.toFixed(1)}</div>
        </div>
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-600">{isZh ? "稳定性" : "Stability"}</div>
          <div className="font-bold text-zinc-900">{review.stabilityScore.toFixed(1)}</div>
        </div>
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-600">{isZh ? "舒适度" : "Comfort"}</div>
          <div className="font-bold text-zinc-900">{review.comfortScore.toFixed(1)}</div>
        </div>
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-600">{isZh ? "性价比" : "Value"}</div>
          <div className="font-bold text-zinc-900">{review.valueScore.toFixed(1)}</div>
        </div>
      </div>

      {/* Date */}
      <p className="text-xs text-zinc-400">
        {new Date(review.testDate).toLocaleDateString(isZh ? "zh-CN" : "en-US")}
      </p>
    </Link>
  );
}
