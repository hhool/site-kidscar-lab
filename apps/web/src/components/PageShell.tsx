"use client";

import { type Locale } from "@/lib/constants/locales";
import { useAppLang } from "@/components/useAppLang";

type LocalizedText = {
  zh: string;
  en: string;
};

type PageShellProps = {
  title: string | LocalizedText;
  description: string | LocalizedText;
  children?: React.ReactNode;
};

function pick(lang: Locale, value: string | LocalizedText) {
  if (typeof value === "string") {
    return value;
  }
  return lang === "zh" ? value.zh : value.en;
}

export function PageShell({ title, description, children }: PageShellProps) {
  const { lang } = useAppLang();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{pick(lang, title)}</h1>
        <p className="mt-3 max-w-3xl text-zinc-600">{pick(lang, description)}</p>
      </section>
      {children}
    </main>
  );
}
