"use client";

import Link from "next/link";
import { useAppLang } from "./useAppLang";
import { ROUTES } from "@/lib/constants/routes";
import { type RankingItem, type RankingType, getScoreByType } from "@/lib/rankings-data";

interface RankingCardProps {
  item: RankingItem & { rank: number };
  type: RankingType;
}

function rankStyle(rank: number) {
  if (rank === 1) return "bg-amber-100 text-amber-800";
  if (rank === 2) return "bg-zinc-200 text-zinc-800";
  if (rank === 3) return "bg-orange-100 text-orange-800";
  return "bg-zinc-100 text-zinc-700";
}

export function RankingCard({ item, type }: RankingCardProps) {
  const { isZh } = useAppLang();

  const score = getScoreByType(item, type);
  const productName = isZh ? item.productName.zh : item.productName.en;
  const category = isZh ? item.category.zh : item.category.en;
  const priceRange = isZh ? item.priceRange.zh : item.priceRange.en;
  const highlight = isZh ? item.highlight.zh : item.highlight.en;

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-bold ${rankStyle(item.rank)}`}>
            #{item.rank}
          </span>
          {item.featured && (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
              {isZh ? "重点推荐" : "Featured"}
            </span>
          )}
        </div>
        <span className="rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 text-sm font-bold text-emerald-700">
          {score.toFixed(1)}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-zinc-900">{productName}</h3>
      <p className="mb-3 text-sm text-zinc-600">
        {category} · {priceRange}
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {item.badges.map((badge) => (
          <span key={`${item.id}-${badge.en}`} className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
            {isZh ? badge.zh : badge.en}
          </span>
        ))}
      </div>

      <p className="mb-4 text-sm text-zinc-600">{highlight}</p>

      <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-600">{isZh ? "综合" : "Overall"}</div>
          <div className="font-bold text-zinc-900">{item.scores.overall.toFixed(1)}</div>
        </div>
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-600">{isZh ? "安全" : "Safety"}</div>
          <div className="font-bold text-zinc-900">{item.scores.safety.toFixed(1)}</div>
        </div>
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-600">{isZh ? "性价比" : "Value"}</div>
          <div className="font-bold text-zinc-900">{item.scores.value.toFixed(1)}</div>
        </div>
        <div className="rounded bg-zinc-50 p-2">
          <div className="text-zinc-600">{isZh ? "舒适" : "Comfort"}</div>
          <div className="font-bold text-zinc-900">{item.scores.comfort.toFixed(1)}</div>
        </div>
      </div>

      <Link href={ROUTES.products} className="inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">
        {isZh ? "查看产品" : "View Product"} →
      </Link>
    </article>
  );
}
