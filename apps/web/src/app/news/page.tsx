"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import { usePhase3Content } from "@/components/usePhase3Content";
import {
  ALL_NEWS_CATEGORIES,
  NEWS_CATEGORIES,
  type NewsCategory,
} from "@/lib/news-data";

export default function NewsPage() {
  const { isZh } = useAppLang();
  const content = usePhase3Content();
  const [filter, setFilter] = useState<NewsCategory | "">("");

  const filtered = useMemo(
    () => (filter ? content.news.filter((n) => n.category === filter) : content.news),
    [content.news, filter],
  );

  const label = (zh: string, en: string) => (isZh ? zh : en);

  const CATEGORY_COLORS: Record<string, string> = {
    industry:     "bg-blue-100 text-blue-700",
    release:      "bg-emerald-100 text-emerald-700",
    event:        "bg-amber-100 text-amber-700",
    transparency: "bg-violet-100 text-violet-700",
    media:        "bg-zinc-100 text-zinc-700",
  };

  return (
    <PageShell
      title={{ zh: "资讯", en: "News & Updates" }}
      description={{
        zh: "行业动态、新品发布、活动促销与透明度更新。",
        en: "Industry updates, new releases, events, and transparency reports.",
      }}
    >
      {/* Category Filter */}
      <section className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            filter === "" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
          }`}
        >
          {label("全部", "All")}
        </button>
        {ALL_NEWS_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              filter === c ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
            }`}
          >
            {isZh ? NEWS_CATEGORIES[c].zh : NEWS_CATEGORIES[c].en}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-zinc-500">
          {filtered.length} {label("条", "items")}
        </span>
      </section>

      {/* News List */}
      <section className="mt-4 space-y-4">
        {filtered.map((item) => (
          <article key={item.id} className="rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-colors">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[item.category]}`}>
                {isZh ? NEWS_CATEGORIES[item.category].zh : NEWS_CATEGORIES[item.category].en}
              </span>
              <span className="text-xs text-zinc-400">{item.date}</span>
              <span className="text-xs text-zinc-400">· {isZh ? item.source.zh : item.source.en}</span>
            </div>
            <h2 className="mt-2 font-semibold text-zinc-900">
              {isZh ? item.title.zh : item.title.en}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 leading-relaxed">
              {isZh ? item.summary.zh : item.summary.en}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((t, i) => (
                <span key={i} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                  {isZh ? t.zh : t.en}
                </span>
              ))}
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-400">
            {label("暂无此分类内容", "No items in this category")}
          </p>
        )}
      </section>
    </PageShell>
  );
}
