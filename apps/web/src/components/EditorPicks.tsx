"use client";

import Link from "next/link";
import { useAppLang } from "./useAppLang";
import { ROUTES } from "@/lib/constants/routes";

interface EditorPick {
  id: string;
  title: { zh: string; en: string };
  category: { zh: string; en: string };
  reason: { zh: string; en: string };
  price: string;
}

const editorPicks: EditorPick[] = [
  {
    id: "pick-1",
    title: { zh: "平衡车入门首选", en: "Best Balance Bike Starter" },
    category: { zh: "3-5 岁", en: "Age 3-5" },
    reason: { zh: "稳定性强，安全认证通过", en: "Excellent stability & safety certified" },
    price: "$89",
  },
  {
    id: "pick-2",
    title: { zh: "儿童自行车进阶款", en: "Advanced Kids Bike" },
    category: { zh: "6-8 岁", en: "Age 6-8" },
    reason: { zh: "轻量级设计，骑行流畅", en: "Lightweight design & smooth ride" },
    price: "$129",
  },
  {
    id: "pick-3",
    title: { zh: "三轮车安全标杆", en: "Safety Standard Tricycle" },
    category: { zh: "2-4 岁", en: "Age 2-4" },
    reason: { zh: "双安全装置，家长放心", en: "Dual safety features for parents" },
    price: "$99",
  },
];

export function EditorPicks() {
  const { isZh } = useAppLang();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">
          {isZh ? "📝 编辑精选" : "📝 Editor's Picks"}
        </h2>
        <Link href={ROUTES.products} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          {isZh ? "浏览产品 →" : "Browse Products →"}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {editorPicks.map((pick) => (
          <Link
            key={pick.id}
            href={ROUTES.products}
            className="rounded-lg border border-zinc-100 bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 transition hover:border-zinc-300 hover:from-blue-50 hover:to-blue-100"
          >
            <div className="mb-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
              {isZh ? pick.category.zh : pick.category.en}
            </div>
            <h3 className="font-semibold text-zinc-900">{isZh ? pick.title.zh : pick.title.en}</h3>
            <p className="mt-2 text-sm text-zinc-600">
              {isZh ? pick.reason.zh : pick.reason.en}
            </p>
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-zinc-200">
              <span className="font-bold text-green-600">{pick.price}</span>
              <span className="text-xs text-zinc-500">⭐ 9.2</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
