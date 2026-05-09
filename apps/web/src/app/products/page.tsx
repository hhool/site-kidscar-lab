import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductsList } from "@/components/ProductsList";

export default function ProductsPage() {
  return (
    <PageShell
      title={{ zh: "产品", en: "Products" }}
      description={{
        zh: "按品类、价格与关键词筛选产品，并快速进入对比流程。",
        en: "Filter products by category, price, and keyword, then quickly move into comparison.",
      }}
    >
      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Suspense fallback={<div className="h-96 rounded-xl border border-zinc-200 bg-white p-6" />}>
              <ProductFilters />
            </Suspense>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 rounded-xl border border-zinc-200 bg-white" />
            ))}
          </div>}>
            <ProductsList />
          </Suspense>
        </div>
      </div>
    </PageShell>
  );
}
