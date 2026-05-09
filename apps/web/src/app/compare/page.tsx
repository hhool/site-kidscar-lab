"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import {
  ALL_METRICS,
  RESULT_METRIC_LABELS,
  mockTestResults,
  type ResultMetric,
} from "@/lib/test-results-data";

const MAX_COMPARE = 4;

function ScoreBar({ value, best }: { value: number; best: number }) {
  const isBest = value === best;
  const pct = Math.round((value / 10) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full transition-all ${isBest ? "bg-emerald-500" : "bg-zinc-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`w-8 text-right text-sm font-medium ${isBest ? "text-emerald-700" : "text-zinc-700"}`}>
        {value.toFixed(1)}
      </span>
      {isBest && (
        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
          ★
        </span>
      )}
    </div>
  );
}

export default function ComparePage() {
  const { isZh } = useAppLang();
  const [selectedIds, setSelectedIds] = useState<string[]>(["tr-001", "tr-002"]);

  const label = (zh: string, en: string) => (isZh ? zh : en);

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const compareItems = useMemo(
    () => mockTestResults.filter((r) => selectedIds.includes(r.id)),
    [selectedIds],
  );

  const bestScores = useMemo(() => {
    const best: Record<ResultMetric, number> = {} as Record<ResultMetric, number>;
    for (const m of ALL_METRICS) {
      best[m] = Math.max(...compareItems.map((r) => r.scores[m]));
    }
    return best;
  }, [compareItems]);

  return (
    <PageShell
      title={{ zh: "产品对比", en: "Compare Products" }}
      description={{
        zh: "选择 2-4 款产品，按指标并排对比，快速找到最适合的选择。",
        en: "Select 2-4 products to compare metrics side by side and find the best fit.",
      }}
    >
      {/* Product Selector */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-zinc-700">
          {label(`选择产品（最多 ${MAX_COMPARE} 款）`, `Select products (up to ${MAX_COMPARE})`)}
        </h2>
        <div className="flex flex-wrap gap-2">
          {mockTestResults.map((r) => {
            const selected = selectedIds.includes(r.id);
            const disabled = !selected && selectedIds.length >= MAX_COMPARE;
            return (
              <button
                key={r.id}
                onClick={() => toggleProduct(r.id)}
                disabled={disabled}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : disabled
                    ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
                }`}
              >
                {isZh ? r.productName.zh : r.productName.en}
              </button>
            );
          })}
        </div>
        {selectedIds.length < 2 && (
          <p className="mt-2 text-sm text-amber-600">
            {label("请至少选择 2 款产品进行对比", "Please select at least 2 products to compare")}
          </p>
        )}
      </section>

      {/* Compare Table */}
      {compareItems.length >= 2 && (
        <section className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="w-36 px-4 py-3 text-left font-medium text-zinc-700">
                  {label("指标", "Metric")}
                </th>
                {compareItems.map((r) => (
                  <th key={r.id} className="px-4 py-3 text-left font-medium text-zinc-900">
                    <div>{isZh ? r.productName.zh : r.productName.en}</div>
                    <div className="text-xs font-normal text-zinc-500">{r.brand}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {/* Overall */}
              <tr className="bg-zinc-50">
                <td className="px-4 py-3 font-semibold text-zinc-900">{label("综合分", "Overall")}</td>
                {compareItems.map((r) => {
                  const bestOverall = Math.max(...compareItems.map((x) => x.overallScore));
                  const isBest = r.overallScore === bestOverall;
                  return (
                    <td key={r.id} className="px-4 py-3">
                      <ScoreBar value={r.overallScore} best={bestOverall} />
                    </td>
                  );
                })}
              </tr>
              {/* Per metric */}
              {ALL_METRICS.map((m) => (
                <tr key={m} className="hover:bg-zinc-50/50">
                  <td className="px-4 py-3 text-zinc-700">
                    {isZh ? RESULT_METRIC_LABELS[m].zh : RESULT_METRIC_LABELS[m].en}
                  </td>
                  {compareItems.map((r) => (
                    <td key={r.id} className="px-4 py-3">
                      <ScoreBar value={r.scores[m]} best={bestScores[m]} />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Meta */}
              <tr className="border-t border-zinc-200">
                <td className="px-4 py-3 text-zinc-500">{label("测试日期", "Tested")}</td>
                {compareItems.map((r) => (
                  <td key={r.id} className="px-4 py-3 text-zinc-500">{r.testedDate}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-500">{label("样本量", "Sample n")}</td>
                {compareItems.map((r) => (
                  <td key={r.id} className="px-4 py-3 text-zinc-500">{r.sampleSize}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-zinc-500">{label("方法版本", "Method")}</td>
                {compareItems.map((r) => (
                  <td key={r.id} className="px-4 py-3 text-zinc-500">{r.methodVersion}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </PageShell>
  );
}
