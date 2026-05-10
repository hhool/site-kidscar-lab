"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import {
  ALL_AGE_GROUPS,
  ALL_BRANDS,
  ALL_CATEGORIES,
  ALL_METRICS,
  RESULT_AGE_LABELS,
  RESULT_CATEGORY_LABELS,
  RESULT_METRIC_LABELS,
  mockTestResults,
  type ResultAgeGroup,
  type ResultBrand,
  type ResultCategory,
} from "@/lib/test-results-data";

function ScoreCell({ value }: { value: number }) {
  const color =
    value >= 9.5 ? "text-emerald-700 font-semibold" :
    value >= 8.5 ? "text-zinc-900" :
    "text-amber-700";
  return <span className={color}>{value.toFixed(1)}</span>;
}

export default function TestResultsPage() {
  const { isZh } = useAppLang();

  const [filterCategory, setFilterCategory] = useState<ResultCategory | "">("");
  const [filterAge, setFilterAge] = useState<ResultAgeGroup | "">("");
  const [filterBrand, setFilterBrand] = useState<ResultBrand | "">("");

  const filtered = useMemo(() => {
    return mockTestResults.filter((r) => {
      if (filterCategory && r.category !== filterCategory) return false;
      if (filterAge && r.ageGroup !== filterAge) return false;
      if (filterBrand && r.brand !== filterBrand) return false;
      return true;
    });
  }, [filterCategory, filterAge, filterBrand]);

  const label = (zh: string, en: string) => (isZh ? zh : en);

  return (
    <PageShell
      title={{ zh: "测试结果数据库", en: "Test Results Database" }}
      description={{
        zh: "所有测试产品的原始指标数据，支持多维筛选与下载。",
        en: "Raw metric data for all tested products, with multi-dimension filtering and export.",
      }}
    >
      {/* Filters */}
      <section className="mt-6 flex flex-wrap gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as ResultCategory | "")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          <option value="">{label("全部品类", "All Categories")}</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{isZh ? RESULT_CATEGORY_LABELS[c].zh : RESULT_CATEGORY_LABELS[c].en}</option>
          ))}
        </select>

        <select
          value={filterAge}
          onChange={(e) => setFilterAge(e.target.value as ResultAgeGroup | "")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          <option value="">{label("全部年龄段", "All Age Groups")}</option>
          {ALL_AGE_GROUPS.map((a) => (
            <option key={a} value={a}>{isZh ? RESULT_AGE_LABELS[a].zh : RESULT_AGE_LABELS[a].en}</option>
          ))}
        </select>

        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value as ResultBrand | "")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          <option value="">{label("全部品牌", "All Brands")}</option>
          {ALL_BRANDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <button
          onClick={() => { setFilterCategory(""); setFilterAge(""); setFilterBrand(""); }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
        >
          {label("重置", "Reset")}
        </button>

        <span className="ml-auto self-center text-sm text-zinc-500">
          {filtered.length} {label("条记录", "results")}
        </span>

        {/* Download placeholder */}
        <button
          title={label("导出功能开发中", "Export coming soon")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-400 cursor-not-allowed"
          disabled
        >
          ↓ {label("导出 CSV", "Export CSV")}
        </button>
      </section>

      {/* Results Table */}
      <section className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">{label("产品", "Product")}</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">{label("品类", "Category")}</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">{label("年龄段", "Age")}</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">{label("样本量", "n")}</th>
              {ALL_METRICS.map((m) => (
                <th key={m} className="px-3 py-3 text-center font-medium text-zinc-700">
                  {isZh ? RESULT_METRIC_LABELS[m].zh : RESULT_METRIC_LABELS[m].en}
                </th>
              ))}
              <th className="px-4 py-3 text-center font-medium text-zinc-900">{label("综合分", "Overall")}</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">{label("测试日期", "Tested")}</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-700">{label("方法版本", "Method")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-sm text-zinc-400">
                  {label("暂无符合条件的数据", "No results match your filters")}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{isZh ? r.productName.zh : r.productName.en}</td>
                  <td className="px-4 py-3 text-zinc-600">{isZh ? RESULT_CATEGORY_LABELS[r.category].zh : RESULT_CATEGORY_LABELS[r.category].en}</td>
                  <td className="px-4 py-3 text-zinc-600">{isZh ? RESULT_AGE_LABELS[r.ageGroup].zh : RESULT_AGE_LABELS[r.ageGroup].en}</td>
                  <td className="px-4 py-3 text-zinc-600">{r.sampleSize}</td>
                  {ALL_METRICS.map((m) => (
                    <td key={m} className="px-3 py-3 text-center">
                      <ScoreCell value={r.scores[m]} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center text-base font-bold text-zinc-900">{r.overallScore.toFixed(1)}</td>
                  <td className="px-4 py-3 text-zinc-500">{r.testedDate}</td>
                  <td className="px-4 py-3 text-zinc-500">{r.methodVersion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </PageShell>
  );
}
