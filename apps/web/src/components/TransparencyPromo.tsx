"use client";

import Link from "next/link";
import { useAppLang } from "./useAppLang";
import { ROUTES } from "@/lib/constants/routes";

interface TransparencyItem {
  icon: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  href: string;
}

const transparencyItems: TransparencyItem[] = [
  {
    icon: "🔬",
    title: { zh: "测试方法", en: "Test Methodology" },
    description: {
      zh: "了解我们如何进行独立评测，确保数据客观",
      en: "Learn how we conduct independent tests for objectivity",
    },
    href: ROUTES.methodology,
  },
  {
    icon: "📊",
    title: { zh: "测试结果库", en: "Test Results Database" },
    description: {
      zh: "查看完整的指标数据与筛选分析",
      en: "Browse complete metrics and analysis",
    },
    href: ROUTES.testResults,
  },
  {
    icon: "🔄",
    title: { zh: "对比工具", en: "Compare Tool" },
    description: {
      zh: "2-4 款产品并排对比，快速做出决定",
      en: "Compare 2-4 products side-by-side",
    },
    href: ROUTES.compare,
  },
  {
    icon: "ℹ️",
    title: { zh: "关于我们", en: "About Us" },
    description: {
      zh: "了解我们的团队、使命与透明度承诺",
      en: "Learn about our team, mission & commitment",
    },
    href: ROUTES.about,
  },
];

export function TransparencyPromo() {
  const { isZh } = useAppLang();

  return (
    <div className="rounded-xl border border-zinc-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <h2 className="mb-2 text-2xl font-bold text-zinc-900">
        {isZh ? "🛡️ 透明度优先" : "🛡️ Transparency First"}
      </h2>
      <p className="mb-6 text-zinc-600">
        {isZh
          ? "我们相信透明的评测流程和可追溯的数据，帮助家长做出明智决策。"
          : "We believe in transparent testing and traceable data to help you make wise decisions."}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {transparencyItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex gap-4 rounded-lg border border-white/50 bg-white/70 p-4 backdrop-blur transition hover:border-white hover:bg-white"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center text-2xl">
              {item.icon}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">
                {isZh ? item.title.zh : item.title.en}
              </h3>
              <p className="mt-1 text-sm text-zinc-600">
                {isZh ? item.description.zh : item.description.en}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
