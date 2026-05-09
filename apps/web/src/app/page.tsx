"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import { ROUTES } from "@/lib/constants/routes";

const moduleLinks = [
  {
    href: ROUTES.reviews,
    title: { zh: "评测", en: "Reviews" },
    desc: { zh: "最新评测、分类评测、更新记录", en: "Latest reviews, category views, and changelog." },
  },
  {
    href: ROUTES.rankings,
    title: { zh: "排名", en: "Rankings" },
    desc: { zh: "综合分、特性、用户评分、安全与性价比", en: "Composite score, feature score, user score, safety, and value." },
  },
  {
    href: ROUTES.products,
    title: { zh: "产品", en: "Products" },
    desc: { zh: "结构化参数、筛选和对比入口", en: "Structured specs with filtering and compare entries." },
  },
  {
    href: ROUTES.news,
    title: { zh: "资讯", en: "News" },
    desc: { zh: "行业动态、发布和透明度更新", en: "Industry updates, launches, and transparency updates." },
  },
  {
    href: ROUTES.about,
    title: { zh: "关于", en: "About" },
    desc: { zh: "测试方法、数据来源与团队透明度", en: "Methodology, data sources, and team transparency." },
  },
  {
    href: ROUTES.compare,
    title: { zh: "对比", en: "Compare" },
    desc: { zh: "2-4 产品并排对比", en: "Side-by-side comparison for 2-4 products." },
  },
  {
    href: ROUTES.methodology,
    title: { zh: "测试方法", en: "Methodology" },
    desc: { zh: "指标定义与评分规则", en: "Metric definitions and scoring rules." },
  },
  {
    href: ROUTES.testResults,
    title: { zh: "测试结果", en: "Test Results" },
    desc: { zh: "指标数据库与筛选", en: "Metric database with filter placeholders." },
  },
  {
    href: ROUTES.guides,
    title: { zh: "指南", en: "Guides" },
    desc: { zh: "购买和使用指导", en: "Buying and usage guides." },
  },
  {
    href: ROUTES.brands,
    title: { zh: "品牌", en: "Brands" },
    desc: { zh: "品牌档案与型号聚合", en: "Brand profile and model aggregation." },
  },
  {
    href: ROUTES.deals,
    title: { zh: "优惠", en: "Deals" },
    desc: { zh: "价格占位和优惠聚合", en: "Price trend placeholders and deal aggregation." },
  },
  {
    href: ROUTES.community,
    title: { zh: "社区", en: "Community" },
    desc: { zh: "反馈、问答与投票占位", en: "Feedback, Q&A, and voting placeholders." },
  },
];

export default function Home() {
  const { isZh } = useAppLang();

  return (
    <PageShell
      title={{ zh: "童车评测站点工程化骨架", en: "Kids Mobility Review Engineering Scaffold" }}
      description={{
        zh: "已从静态原型迁移到 Next.js。当前页面用于承接 Phase 0 Day 3 的语言与导航状态能力。",
        en: "Migrated from static prototype to Next.js. This page now carries Day 3 language and navigation-state capabilities.",
      }}
    >
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moduleLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-400"
          >
            <h2 className="font-medium text-zinc-900">{isZh ? item.title.zh : item.title.en}</h2>
            <p className="mt-2 text-sm text-zinc-600">{isZh ? item.desc.zh : item.desc.en}</p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
