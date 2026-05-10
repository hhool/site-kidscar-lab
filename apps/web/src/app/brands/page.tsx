"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import { usePhase3Content } from "@/components/usePhase3Content";
import { ORIGIN_LABELS, type BrandOrigin } from "@/lib/brands-data";

const ALL_ORIGINS: BrandOrigin[] = ["CN", "DE", "US", "JP", "KR"];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 9.5 ? "bg-emerald-100 text-emerald-700" : score >= 9 ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-700";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>{score.toFixed(1)}</span>;
}

export default function BrandsPage() {
  const { isZh } = useAppLang();
  const content = usePhase3Content();
  const [filterOrigin, setFilterOrigin] = useState<BrandOrigin | "">("");

  const label = (zh: string, en: string) => (isZh ? zh : en);

  const filtered = filterOrigin ? content.brands.filter((b) => b.origin === filterOrigin) : content.brands;

  return (
    <PageShell
      title={{ zh: "品牌与型号", en: "Brands & Models" }}
      description={{
        zh: "品牌档案、认证资质与旗下型号评分概览。",
        en: "Brand profiles, certifications, and model score overview.",
      }}
    >
      {/* Origin Filter */}
      <section className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterOrigin("")}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            filterOrigin === "" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
          }`}
        >
          {label("全部", "All")}
        </button>
        {ALL_ORIGINS.filter((o) => content.brands.some((b) => b.origin === o)).map((o) => (
          <button
            key={o}
            onClick={() => setFilterOrigin(o)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              filterOrigin === o ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
            }`}
          >
            {isZh ? ORIGIN_LABELS[o].zh : ORIGIN_LABELS[o].en}
          </button>
        ))}
      </section>

      {/* Brand Cards */}
      <section className="mt-4 space-y-4">
        {filtered.map((brand) => (
          <div key={brand.id} className="rounded-xl border border-zinc-200 bg-white p-5">
            {/* Brand Header */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white">
                {brand.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-zinc-900">{brand.name}</h2>
                  <span className="text-xs text-zinc-500">
                    {isZh ? ORIGIN_LABELS[brand.origin].zh : ORIGIN_LABELS[brand.origin].en} · {label("成立于", "Est.")} {brand.founded}
                  </span>
                  <ScoreBadge score={brand.avgScore} />
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  {isZh ? brand.description.zh : brand.description.en}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {brand.certifications.map((c) => (
                    <span key={c} className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Models */}
            <div className="mt-4 border-t border-zinc-100 pt-4">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                {label("旗下型号", "Models")}
              </h3>
              <div className="space-y-2">
                {brand.models.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-4 rounded-lg bg-zinc-50 px-3 py-2">
                    <span className="text-sm font-medium text-zinc-800">
                      {isZh ? m.name.zh : m.name.en}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-zinc-500">${m.priceValue}</span>
                      <ScoreBadge score={m.overallScore} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-400">
            {label("暂无此产地品牌", "No brands from this origin")}
          </p>
        )}
      </section>
    </PageShell>
  );
}
