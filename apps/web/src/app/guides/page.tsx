"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import { usePhase3Content } from "@/components/usePhase3Content";
import {
  ALL_GUIDE_CATEGORIES,
  GUIDE_CATEGORIES,
  type GuideCategory,
} from "@/lib/guides-data";

export default function GuidesPage() {
  const { lang, isZh } = useAppLang();
  const content = usePhase3Content();
  const [filter, setFilter] = useState<GuideCategory | "">("");

  const filtered = useMemo(
    () => (filter ? content.guides.filter((g) => g.category === filter) : content.guides),
    [content.guides, filter],
  );

  const label = (zh: string, en: string) => (isZh ? zh : en);

  return (
    <PageShell
      title={{ zh: "指南与文章", en: "Guides & Articles" }}
      description={{
        zh: "选购建议、安全须知、保养技巧与年龄对照指南。",
        en: "Buying advice, safety tips, maintenance guides, and age-match references.",
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
        {ALL_GUIDE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              filter === c ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
            }`}
          >
            {isZh ? GUIDE_CATEGORIES[c].zh : GUIDE_CATEGORIES[c].en}
          </button>
        ))}
      </section>

      {/* Guide Cards */}
      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        {filtered.map((g) => (
          <Link
            key={g.id}
            href={`/guides/${g.slug}?lang=${lang}`}
            className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                {isZh ? GUIDE_CATEGORIES[g.category].zh : GUIDE_CATEGORIES[g.category].en}
              </span>
              <span className="text-xs text-zinc-400">{g.readingTime} {label("分钟阅读", "min read")}</span>
            </div>
            <h2 className="mt-2 font-semibold text-zinc-900 leading-snug">
              {isZh ? g.title.zh : g.title.en}
            </h2>
            <p className="mt-1.5 flex-1 text-sm text-zinc-600 leading-relaxed">
              {isZh ? g.summary.zh : g.summary.en}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {g.tags.slice(0, 2).map((t, i) => (
                  <span key={i} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                    {isZh ? t.zh : t.en}
                  </span>
                ))}
              </div>
              <span className="text-xs text-zinc-400">{g.updatedDate ?? g.publishedDate}</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-12 text-center text-sm text-zinc-400">
            {label("暂无此分类指南", "No guides in this category")}
          </p>
        )}
      </section>
    </PageShell>
  );
}
