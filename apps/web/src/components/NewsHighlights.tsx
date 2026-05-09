"use client";

import Link from "next/link";
import { useAppLang } from "./useAppLang";
import { ROUTES } from "@/lib/constants/routes";

interface NewsItem {
  id: string;
  title: { zh: string; en: string };
  date: { zh: string; en: string };
  category: { zh: string; en: string };
  excerpt: { zh: string; en: string };
}

const newsHighlights: NewsItem[] = [
  {
    id: "news-1",
    title: { zh: "新款安全认证童车发布", en: "New Safety-Certified Kids Bike Released" },
    date: { zh: "2 天前", en: "2 days ago" },
    category: { zh: "发布", en: "Release" },
    excerpt: {
      zh: "国际安全标准 ISO 8098 认证，刹车系统通过 EN 14766 测试...",
      en: "Certified to ISO 8098, brake system tested per EN 14766...",
    },
  },
  {
    id: "news-2",
    title: { zh: "儿童骑行安全调查报告", en: "Kids Cycling Safety Study Published" },
    date: { zh: "1 周前", en: "1 week ago" },
    category: { zh: "研究", en: "Research" },
    excerpt: {
      zh: "调查显示 73% 的儿童从未进行安全教育，我们的建议是...",
      en: "Study reveals 73% of kids lack safety training. Here's what we recommend...",
    },
  },
  {
    id: "news-3",
    title: { zh: "五月限时优惠活动启动", en: "May Flash Sale Begins" },
    date: { zh: "3 天前", en: "3 days ago" },
    category: { zh: "活动", en: "Promo" },
    excerpt: {
      zh: "精选产品最高优惠 30%，详情见优惠专页...",
      en: "Up to 30% off select products. Check our deals page for details...",
    },
  },
];

export function NewsHighlights() {
  const { isZh } = useAppLang();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">
          {isZh ? "📰 最新资讯" : "📰 Latest News"}
        </h2>
        <Link href={ROUTES.news} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          {isZh ? "查看全部 →" : "View All →"}
        </Link>
      </div>

      <div className="space-y-3">
        {newsHighlights.map((item) => (
          <Link
            key={item.id}
            href={ROUTES.news}
            className="flex gap-4 rounded-lg border border-zinc-100 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-white"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-red-100">
              <span className="text-lg">📄</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-zinc-900 line-clamp-1">
                  {isZh ? item.title.zh : item.title.en}
                </h3>
                <span className="text-xs font-medium text-orange-600 flex-shrink-0">
                  {isZh ? item.category.zh : item.category.en}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                {isZh ? item.excerpt.zh : item.excerpt.en}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                {isZh ? item.date.zh : item.date.en}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
