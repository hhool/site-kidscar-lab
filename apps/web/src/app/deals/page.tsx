"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import {
  ALL_DEAL_STATUSES,
  CHANNEL_LABELS,
  STATUS_LABELS,
  mockDeals,
  type DealStatus,
} from "@/lib/deals-data";

const STATUS_COLORS: Record<DealStatus, string> = {
  active:  "bg-emerald-100 text-emerald-700",
  coming:  "bg-amber-100 text-amber-700",
  expired: "bg-zinc-100 text-zinc-500",
};

function MiniPriceChart({ history }: { history: { date: string; price: number }[] }) {
  const max = Math.max(...history.map((h) => h.price));
  const min = Math.min(...history.map((h) => h.price));
  const range = max - min || 1;
  const W = 80, H = 28, pad = 3;
  const points = history.map((h, i) => {
    const x = pad + (i / (history.length - 1)) * (W - pad * 2);
    const y = H - pad - ((h.price - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={W} height={H} className="text-blue-500">
      <polyline points={points.join(" ")} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {history.map((h, i) => {
        const [x, y] = points[i].split(",").map(Number);
        return <circle key={i} cx={x} cy={y} r="2" fill="currentColor" />;
      })}
    </svg>
  );
}

export default function DealsPage() {
  const { isZh } = useAppLang();
  const [filterStatus, setFilterStatus] = useState<DealStatus | "">("");

  const filtered = useMemo(
    () => (filterStatus ? mockDeals.filter((d) => d.status === filterStatus) : mockDeals),
    [filterStatus],
  );

  const label = (zh: string, en: string) => (isZh ? zh : en);

  return (
    <PageShell
      title={{ zh: "优惠与价格", en: "Deals & Prices" }}
      description={{
        zh: "实时渠道优惠、历史价格趋势与购买时机参考。",
        en: "Live channel deals, historical price trends, and buying timing reference.",
      }}
    >
      {/* Status Filter */}
      <section className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("")}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            filterStatus === "" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
          }`}
        >
          {label("全部", "All")}
        </button>
        {ALL_DEAL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              filterStatus === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
            }`}
          >
            {isZh ? STATUS_LABELS[s].zh : STATUS_LABELS[s].en}
          </button>
        ))}
      </section>

      {/* Deals List */}
      <section className="mt-4 space-y-4">
        {filtered.map((deal) => (
          <div
            key={deal.id}
            className={`rounded-xl border bg-white p-5 ${deal.status === "expired" ? "opacity-60 border-zinc-200" : "border-zinc-200 hover:border-zinc-400 transition-colors"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[deal.status]}`}>
                    {isZh ? STATUS_LABELS[deal.status].zh : STATUS_LABELS[deal.status].en}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {isZh ? CHANNEL_LABELS[deal.channel].zh : CHANNEL_LABELS[deal.channel].en}
                  </span>
                  {deal.validUntil && (
                    <span className="text-xs text-zinc-400">
                      {label("截止", "Until")} {deal.validUntil}
                    </span>
                  )}
                </div>
                <h2 className="mt-1.5 font-semibold text-zinc-900">
                  {isZh ? deal.productName.zh : deal.productName.en}
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  {isZh ? deal.description.zh : deal.description.en}
                </p>
              </div>

              {/* Price Block */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-zinc-900">${deal.dealPrice}</span>
                  <span className="text-sm text-zinc-400 line-through">${deal.originalPrice}</span>
                </div>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  -{deal.discount}%
                </span>
              </div>
            </div>

            {/* Price History */}
            <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-3">
              <span className="text-xs text-zinc-400">{label("价格趋势", "Price trend")}</span>
              <MiniPriceChart history={deal.priceHistory} />
              <span className="text-xs text-zinc-400">
                {label("近 5 个月", "Last 5 months")} · {label("最低", "Low")} ${Math.min(...deal.priceHistory.map((h) => h.price))}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-400">
            {label("暂无此状态优惠", "No deals with this status")}
          </p>
        )}
      </section>
    </PageShell>
  );
}
