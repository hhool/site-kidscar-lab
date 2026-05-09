"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAppLang } from "./useAppLang";
import { RANKING_TYPES, type RankingType } from "@/lib/rankings-data";

export function RankingSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isZh } = useAppLang();

  const currentType = (searchParams.get("type") as RankingType) || "overall";

  const updateType = (type: RankingType) => {
    const params = new URLSearchParams(searchParams);
    if (type === "overall") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : "");
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="mb-3 text-lg font-bold text-zinc-900">{isZh ? "🏆 榜单类型" : "🏆 Ranking Type"}</h2>
      <div className="flex flex-wrap gap-2">
        {(Object.entries(RANKING_TYPES) as [RankingType, { zh: string; en: string }][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => updateType(key)}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              currentType === key
                ? "bg-blue-600 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-blue-300"
            }`}
          >
            {isZh ? label.zh : label.en}
          </button>
        ))}
      </div>
    </div>
  );
}
