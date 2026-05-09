"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import { mockFeedback, mockPolls, mockQAPosts } from "@/lib/community-data";

type Tab = "qa" | "polls" | "feedback";

const STATUS_COLORS = {
  open:     "bg-amber-100 text-amber-700",
  answered: "bg-emerald-100 text-emerald-700",
  closed:   "bg-zinc-100 text-zinc-500",
};

export default function CommunityPage() {
  const { isZh } = useAppLang();
  const [tab, setTab] = useState<Tab>("qa");

  const label = (zh: string, en: string) => (isZh ? zh : en);

  const TABS: { id: Tab; zh: string; en: string }[] = [
    { id: "qa",       zh: "问答",   en: "Q&A" },
    { id: "polls",    zh: "投票",   en: "Polls" },
    { id: "feedback", zh: "用户反馈", en: "Feedback" },
  ];

  const STATUS_LABEL = {
    open:     { zh: "待回答", en: "Open" },
    answered: { zh: "已回答", en: "Answered" },
    closed:   { zh: "已关闭", en: "Closed" },
  };

  return (
    <PageShell
      title={{ zh: "社区与反馈", en: "Community & Feedback" }}
      description={{
        zh: "用户问答、投票与产品反馈，共建可信赖的童车参考社区。",
        en: "User Q&A, polls, and product feedback — building a trustworthy kids bike reference community.",
      }}
    >
      {/* Tab Nav */}
      <div className="mt-6 flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {isZh ? t.zh : t.en}
          </button>
        ))}
      </div>

      {/* Q&A Tab */}
      {tab === "qa" && (
        <section className="mt-4 space-y-4">
          {mockQAPosts.map((post) => (
            <div key={post.id} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[post.status]}`}>
                  {isZh ? STATUS_LABEL[post.status].zh : STATUS_LABEL[post.status].en}
                </span>
                <span className="text-xs text-zinc-400">@{post.askedBy} · {post.askedDate}</span>
                <span className="ml-auto text-xs text-zinc-400">
                  {post.answerCount} {label("条回答", "answers")}
                </span>
              </div>
              <h2 className="mt-2 font-semibold text-zinc-900">
                {isZh ? post.question.zh : post.question.en}
              </h2>
              {post.topAnswer && (
                <div className="mt-3 rounded-lg bg-zinc-50 p-3 border-l-2 border-emerald-400">
                  <p className="text-xs font-medium text-emerald-700 mb-1">{label("最佳回答", "Top Answer")}</p>
                  <p className="text-sm text-zinc-700">{isZh ? post.topAnswer.zh : post.topAnswer.en}</p>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((t, i) => (
                  <span key={i} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                    {isZh ? t.zh : t.en}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Polls Tab */}
      {tab === "polls" && (
        <section className="mt-4 space-y-4">
          {mockPolls.map((poll) => (
            <div key={poll.id} className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="font-semibold text-zinc-900">
                {isZh ? poll.question.zh : poll.question.en}
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                {poll.totalVotes} {label("票", "votes")}
                {poll.closingDate && ` · ${label("截止", "Closes")} ${poll.closingDate}`}
              </p>
              <div className="mt-4 space-y-3">
                {poll.options.map((opt) => {
                  const pct = Math.round((opt.votes / poll.totalVotes) * 100);
                  return (
                    <div key={opt.id}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-zinc-700">{isZh ? opt.label.zh : opt.label.en}</span>
                        <span className="font-medium text-zinc-900">{pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                        <div className="h-full rounded-full bg-zinc-800 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Feedback Tab */}
      {tab === "feedback" && (
        <section className="mt-4 space-y-4">
          {mockFeedback.map((fb) => (
            <div key={fb.id} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900">@{fb.author}</span>
                    {fb.verified && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                        {label("已验证购买", "Verified Purchase")}
                      </span>
                    )}
                    <span className="text-xs text-zinc-400">{fb.date}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {label("评测产品", "Product")}: {isZh ? fb.productName.zh : fb.productName.en}
                  </p>
                </div>
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < fb.rating ? "text-amber-400" : "text-zinc-200"}>★</span>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                {isZh ? fb.content.zh : fb.content.en}
              </p>
            </div>
          ))}
        </section>
      )}
    </PageShell>
  );
}
