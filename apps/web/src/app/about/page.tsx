"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xl font-semibold tracking-tight text-zinc-900">{children}</h2>
  );
}

const TEAM_MEMBERS = [
  {
    name: "Alex Chen",
    role: { zh: "首席评测员 · 10 年童车行业经验", en: "Lead Reviewer · 10 years in kids mobility" },
    cert: { zh: "儿童产品安全 L3 认证", en: "Child Product Safety L3 Certified" },
  },
  {
    name: "Maya Liu",
    role: { zh: "人体工学顾问 · 儿童发展专家", en: "Ergonomics Advisor · Child Development Specialist" },
    cert: { zh: "人体工学应用博士", en: "PhD in Applied Ergonomics" },
  },
  {
    name: "Sam Park",
    role: { zh: "数据分析师 · 测试结果质控", en: "Data Analyst · Test QA & Results Control" },
    cert: { zh: "统计学硕士", en: "MSc Statistics" },
  },
];

const DATA_SOURCES = [
  {
    title: { zh: "自购测试", en: "Self-Purchased Testing" },
    body: { zh: "大多数测试产品由我们自费购买，确保评测独立性。", en: "Most test products are purchased by us independently to ensure evaluation independence." },
  },
  {
    title: { zh: "厂商提供样品", en: "Manufacturer-Provided Samples" },
    body: { zh: "当厂商提供产品时，我们在评测中明确标注来源，并保持同等评分标准。", en: "When products are provided by manufacturers, we disclose the source in the review and apply identical scoring standards." },
  },
  {
    title: { zh: "无广告影响", en: "No Advertising Influence" },
    body: { zh: "广告收入与评分决策完全隔离，编辑团队不受商业部门干预。", en: "Ad revenue is fully separated from scoring decisions; the editorial team operates independently of the commercial team." },
  },
];

const PROVENANCE_NODES = [
  {
    label: { zh: "原产地追溯", en: "Origin Traceability" },
    detail: { zh: "追溯至工厂级别的产地信息，含省份、认证资质及品控批次号。", en: "Tracing to factory-level origin including province, certifications, and QC batch number." },
    icon: "📍",
  },
  {
    label: { zh: "原厂背书验证", en: "OEM Endorsement Verification" },
    detail: { zh: "对声称具有品牌授权的产品进行双重核查，比对官方授权文件。", en: "Double-checking brand-licensed products against official authorization documents." },
    icon: "✅",
  },
  {
    label: { zh: "双确认质控流程", en: "Dual-Confirmation QC Process" },
    detail: { zh: "关键测试结论须经独立评测员二次确认，差异超过阈值时触发仲裁。", en: "Key test conclusions require a second confirmation by an independent reviewer; threshold gaps trigger arbitration." },
    icon: "🔍",
  },
  {
    label: { zh: "批次存档", en: "Batch Archiving" },
    detail: { zh: "所有测试样本的批次信息与入库日期均留档，可溯源至具体测试周期。", en: "All sample batches and intake dates are archived and traceable to specific test cycles." },
    icon: "🗂️",
  },
];

export default function AboutPage() {
  const { isZh } = useAppLang();
  const label = (zh: string, en: string) => (isZh ? zh : en);

  return (
    <PageShell
      title={{ zh: "关于我们", en: "About Us" }}
      description={{
        zh: "KidsCarLab 的数据来源、评测团队与透明度承诺。",
        en: "KidsCarLab's data sources, review team, and transparency commitments.",
      }}
    >
      {/* Mission */}
      <section className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
        <p className="text-base leading-relaxed text-zinc-700">
          {label(
            "KidsCarLab 专注于为家长提供独立、可验证的童车测评数据。我们相信每一个评分背后都应有可追溯的测试记录、可解释的评分规则，以及不受商业利益干扰的独立判断。",
            "KidsCarLab is dedicated to providing parents with independent, verifiable kids mobility test data. We believe every score should be backed by traceable test records, explainable scoring rules, and editorial independence free from commercial influence.",
          )}
        </p>
      </section>

      {/* Transparency quick links */}
      <section className="mt-8">
        <SectionHeading>{label("透明度入口", "Transparency Quick Links")}</SectionHeading>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: "/methodology", zh: "测试方法 →", en: "Methodology →", desc: { zh: "流程、指标、版本记录", en: "Process, metrics, version history" } },
            { href: "/test-results", zh: "测试结果数据库 →", en: "Test Results Database →", desc: { zh: "原始数据、多维筛选", en: "Raw data, multi-dimension filters" } },
            { href: "/compare", zh: "产品对比 →", en: "Compare Products →", desc: { zh: "最多 4 款产品并排对比", en: "Side-by-side comparison up to 4 products" } },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400 hover:shadow-sm transition-all"
            >
              <div className="font-medium text-zinc-900">{isZh ? item.zh : item.en}</div>
              <div className="mt-1 text-sm text-zinc-500">{isZh ? item.desc.zh : item.desc.en}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section className="mt-10">
        <SectionHeading>{label("数据来源", "Data Sources")}</SectionHeading>
        <div className="space-y-3">
          {DATA_SOURCES.map((ds, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4">
              <h3 className="font-medium text-zinc-900">{isZh ? ds.title.zh : ds.title.en}</h3>
              <p className="mt-1 text-sm text-zinc-600">{isZh ? ds.body.zh : ds.body.en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mt-10">
        <SectionHeading>{label("评测团队", "Review Team")}</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-3">
          {TEAM_MEMBERS.map((m) => (
            <div key={m.name} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">
                {m.name[0]}
              </div>
              <h3 className="mt-3 font-medium text-zinc-900">{m.name}</h3>
              <p className="mt-1 text-sm text-zinc-600">{isZh ? m.role.zh : m.role.en}</p>
              <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                {isZh ? m.cert.zh : m.cert.en}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Provenance & QC */}
      <section className="mt-10">
        <SectionHeading>{label("产地溯源与质控流程", "Origin Traceability & QC Process")}</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROVENANCE_NODES.map((node, i) => (
            <div key={i} className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4">
              <span className="text-2xl">{node.icon}</span>
              <div>
                <h3 className="font-medium text-zinc-900">{isZh ? node.label.zh : node.label.en}</h3>
                <p className="mt-1 text-sm text-zinc-600">{isZh ? node.detail.zh : node.detail.en}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
