import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { ReviewFilters } from "@/components/ReviewFilters";
import { ReviewsList } from "@/components/ReviewsList";

export default function ReviewsPage() {
  return (
    <PageShell
      title={{ zh: "评测", en: "Reviews" }}
      description={{
        zh: "独立评测、专业数据。浏览所有产品评测，按品类、年龄、价格等条件筛选。",
        en: "Independent testing, professional data. Browse all product reviews with filtering by category, age, and price.",
      }}
    >
      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Suspense fallback={<div className="rounded-xl border border-zinc-200 bg-white p-6 h-96" />}>
              <ReviewFilters />
            </Suspense>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3">
          <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 bg-white h-64" />
            ))}
          </div>}>
            <ReviewsList />
          </Suspense>
        </div>
      </div>
    </PageShell>
  );
}
