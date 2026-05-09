"use client";

import { useSearchParams } from "next/navigation";
import { useAppLang } from "./useAppLang";
import { RankingCard } from "./RankingCard";
import { RANKING_TYPES, getRankingsByType, type RankingType } from "@/lib/rankings-data";

export function RankingsList() {
  const searchParams = useSearchParams();
  const { isZh } = useAppLang();

  const currentType = (searchParams.get("type") as RankingType) || "overall";
  const rankings = getRankingsByType(currentType);
  const typeLabel = isZh ? RANKING_TYPES[currentType].zh : RANKING_TYPES[currentType].en;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900">
          {isZh ? `${typeLabel} 榜` : `${typeLabel} Rankings`} ({rankings.length})
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rankings.map((item) => (
          <RankingCard key={item.id} item={item} type={currentType} />
        ))}
      </div>
    </section>
  );
}
