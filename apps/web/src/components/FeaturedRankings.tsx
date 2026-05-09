"use client";

import Link from "next/link";
import { useAppLang } from "./useAppLang";
import { ROUTES } from "@/lib/constants/routes";

interface RankingItem {
  rank: number;
  title: { zh: string; en: string };
  score: number;
  badge: { zh: string; en: string };
}

const topRankings: RankingItem[] = [
  {
    rank: 1,
    title: { zh: "XYZ-2000 超级童车", en: "XYZ-2000 Super Bike" },
    score: 9.8,
    badge: { zh: "安全第一", en: "Safety First" },
  },
  {
    rank: 2,
    title: { zh: "ABC-500 轻便款", en: "ABC-500 Lightweight" },
    score: 9.5,
    badge: { zh: "性价比冠军", en: "Best Value" },
  },
  {
    rank: 3,
    title: { zh: "DEF-800 全能型", en: "DEF-800 All-in-One" },
    score: 9.3,
    badge: { zh: "功能完整", en: "Feature Rich" },
  },
];

export function FeaturedRankings() {
  const { isZh } = useAppLang();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">
          {isZh ? "🏆 特色榜单" : "🏆 Featured Rankings"}
        </h2>
        <Link href={ROUTES.rankings} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          {isZh ? "查看全部 →" : "View All →"}
        </Link>
      </div>

      <div className="space-y-3">
        {topRankings.map((item) => (
          <Link
            key={item.rank}
            href={ROUTES.rankings}
            className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-white">
                {item.rank}
              </div>
              <div>
                <p className="font-semibold text-zinc-900">
                  {isZh ? item.title.zh : item.title.en}
                </p>
                <span className="text-xs font-medium text-orange-600">
                  {isZh ? item.badge.zh : item.badge.en}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">{item.score}</span>
              <span className="text-sm text-zinc-400">/10</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
