"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import { usePhase3Content } from "@/components/usePhase3Content";
import { GUIDE_CATEGORIES } from "@/lib/guides-data";

export default function GuideDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { lang, isZh } = useAppLang();
  const content = usePhase3Content();

  const guide = content.guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const label = (zh: string, en: string) => (isZh ? zh : en);

  const related = content.guides
    .filter((g) => g.slug !== slug && g.category === guide.category)
    .slice(0, 2);

  const bodyLines = (isZh ? guide.body.zh : guide.body.en)
    .split("\n")
    .filter(Boolean);

  return (
    <PageShell
      title={isZh ? guide.title.zh : guide.title.en}
      description={isZh ? guide.summary.zh : guide.summary.en}
    >
      <div className="mt-6 lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* TOC Sidebar */}
        <aside className="mb-8 lg:mb-0">
          <nav className="sticky top-6 rounded-xl border border-zinc-200 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {label("目录", "Contents")}
            </p>
            <ul className="space-y-2">
              {guide.toc.map((item) => (
                <li key={item.anchor}>
                  <a
                    href={`#${item.anchor}`}
                    className="block rounded-lg px-2 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                  >
                    {isZh ? item.label.zh : item.label.en}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <article>
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
              {isZh ? GUIDE_CATEGORIES[guide.category].zh : GUIDE_CATEGORIES[guide.category].en}
            </span>
            <span>{guide.readingTime} {label("分钟阅读", "min read")}</span>
            <span>·</span>
            <span>
              {label("发布于", "Published")} {guide.publishedDate}
              {guide.updatedDate && ` · ${label("更新于", "Updated")} ${guide.updatedDate}`}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-zinc-900 leading-snug">
            {isZh ? guide.title.zh : guide.title.en}
          </h1>
          <p className="mt-2 text-base text-zinc-600">
            {isZh ? guide.summary.zh : guide.summary.en}
          </p>

          {/* Body */}
          <div className="mt-8 space-y-4 text-zinc-700 leading-relaxed">
            {bodyLines.map((line, i) => {
              if (line.startsWith("## ")) {
                const id = line.replace("## ", "").toLowerCase().replace(/\s+/g, "-");
                return (
                  <h2 key={i} id={id} className="mt-8 text-xl font-semibold text-zinc-900 scroll-mt-6">
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={i} className="mt-6 text-lg font-semibold text-zinc-800">
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc list-inside text-sm">
                    <li>{line.replace("- ", "")}</li>
                  </ul>
                );
              }
              return <p key={i} className="text-sm">{line}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-1.5">
            {guide.tags.map((t, i) => (
              <span key={i} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                {isZh ? t.zh : t.en}
              </span>
            ))}
          </div>

          {/* Back + Related */}
          <div className="mt-10 border-t border-zinc-100 pt-8">
            <Link href={`/guides?lang=${lang}`} className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
              ← {label("返回指南列表", "Back to Guides")}
            </Link>
            {related.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold text-zinc-700">{label("相关指南", "Related Guides")}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/guides/${r.slug}?lang=${lang}`}
                      className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400 transition-colors"
                    >
                      <p className="text-sm font-medium text-zinc-800">
                        {isZh ? r.title.zh : r.title.en}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">{r.readingTime} {label("分钟", "min")}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </PageShell>
  );
}
