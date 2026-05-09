"use client";

import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";

type LocalizedText = {
  zh: string;
  en: string;
};

type PlaceholderPageProps = {
  title: string | LocalizedText;
  description: string | LocalizedText;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const { isZh } = useAppLang();

  return (
    <PageShell title={title} description={description}>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium text-zinc-900">{isZh ? "模块状态" : "Module Status"}</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {isZh
              ? "当前为 Day 3 占位页面，已接入语言与导航状态切换基础能力。"
              : "This is a Day 3 placeholder page with language and navigation-state switching baseline."}
          </p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium text-zinc-900">{isZh ? "下一步" : "Next"}</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {isZh
              ? "继续接入筛选参数体系、登录流程和页面级 i18n 文案配置。"
              : "Continue with filter parameters, auth flow, and per-page i18n content wiring."}
          </p>
        </article>
      </section>
    </PageShell>
  );
}
