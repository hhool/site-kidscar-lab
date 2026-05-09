"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { type ProductItem } from "@/lib/products-data";
import { useAppLang } from "./useAppLang";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isZh } = useAppLang();

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-900">{isZh ? product.name.zh : product.name.en}</h3>
        <span className="rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
          {product.rating.toFixed(1)}
        </span>
      </div>

      <p className="mb-2 text-sm text-zinc-600">
        {isZh ? product.ageGroup.zh : product.ageGroup.en} · ${product.priceValue}
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {product.featured && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
            {isZh ? "重点推荐" : "Featured"}
          </span>
        )}
        {product.tags.map((tag) => (
          <span key={`${product.id}-${tag.en}`} className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
            {isZh ? tag.zh : tag.en}
          </span>
        ))}
      </div>

      <p className="mb-4 text-sm text-zinc-600">{isZh ? product.summary.zh : product.summary.en}</p>

      <Link href={ROUTES.compare} className="inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">
        {isZh ? "加入对比" : "Add to Compare"} →
      </Link>
    </article>
  );
}
