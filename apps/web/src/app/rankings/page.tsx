import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { RankingSelector } from "@/components/RankingSelector";
import { RankingsList } from "@/components/RankingsList";

export default function RankingsPage() {
  return (
    <PageShell
      title={{ zh: "排名", en: "Rankings" }}
      description={{
        zh: "按综合、安全、性价比、舒适度和耐久性切换榜单，快速找到最适合孩子的车型。",
        en: "Switch between overall, safety, value, comfort, and durability rankings to find the best fit.",
      }}
    >
      <div className="mt-6 space-y-6">
        <Suspense fallback={<div className="rounded-xl border border-zinc-200 bg-white p-6 h-28" />}>
          <RankingSelector />
        </Suspense>

        <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 rounded-xl border border-zinc-200 bg-white" />
          ))}
        </div>}>
          <RankingsList />
        </Suspense>
      </div>
    </PageShell>
  );
}
