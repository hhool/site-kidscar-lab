"use client";

import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import {
  METRIC_DEFINITIONS,
  SCORING_RULES,
  TEST_PROCESS_STEPS,
  VERSION_HISTORY,
} from "@/lib/methodology-data";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xl font-semibold tracking-tight text-zinc-900">
      {children}
    </h2>
  );
}

export default function MethodologyPage() {
  const { isZh } = useAppLang();

  return (
    <PageShell
      title={{ zh: "测试方法", en: "Methodology" }}
      description={{
        zh: "我们如何选品、测试与评分——完整流程与指标定义。",
        en: "How we select, test, and score products — full process and metric definitions.",
      }}
    >
      {/* Test Process */}
      <section className="mt-8">
        <SectionHeading>{isZh ? "测试流程" : "Test Process"}</SectionHeading>
        <ol className="space-y-4">
          {TEST_PROCESS_STEPS.map((s) => (
            <li key={s.step} className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                {s.step}
              </span>
              <div>
                <h3 className="font-medium text-zinc-900">{isZh ? s.title.zh : s.title.en}</h3>
                <p className="mt-1 text-sm text-zinc-600">{isZh ? s.description.zh : s.description.en}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Metric Definitions */}
      <section className="mt-10">
        <SectionHeading>{isZh ? "指标定义" : "Metric Definitions"}</SectionHeading>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-zinc-700">{isZh ? "指标" : "Metric"}</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-700">{isZh ? "单位" : "Unit"}</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-700">{isZh ? "评分区间" : "Score Range"}</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-700">{isZh ? "说明" : "Description"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {METRIC_DEFINITIONS.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{isZh ? m.name.zh : m.name.en}</td>
                  <td className="px-4 py-3 text-zinc-600">{isZh ? m.unit.zh : m.unit.en}</td>
                  <td className="px-4 py-3 text-zinc-600">{m.scoreRange}</td>
                  <td className="px-4 py-3 text-zinc-600">{isZh ? m.description.zh : m.description.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scoring Rules */}
      <section className="mt-10">
        <SectionHeading>{isZh ? "评分规则" : "Scoring Rules"}</SectionHeading>
        <div className="space-y-3">
          {SCORING_RULES.map((r, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4">
              <h3 className="font-medium text-zinc-900">{isZh ? r.title.zh : r.title.en}</h3>
              <p className="mt-1 font-mono text-sm text-zinc-600">{isZh ? r.body.zh : r.body.en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Version History */}
      <section className="mt-10">
        <SectionHeading>{isZh ? "版本变更记录" : "Version History"}</SectionHeading>
        <div className="space-y-4">
          {VERSION_HISTORY.map((v) => (
            <div key={v.version} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {v.version}
                </span>
                <span className="text-sm text-zinc-500">{v.date}</span>
              </div>
              <ul className="mt-3 space-y-1">
                {v.changes.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" />
                    {isZh ? c.zh : c.en}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
