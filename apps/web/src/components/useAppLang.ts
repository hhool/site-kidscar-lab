"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/constants/locales";

const LANG_KEY = "kcl_lang";

function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value);
}

export function useAppLang() {
  const pathname = usePathname();
  const router = useRouter();

  const queryLang =
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("lang");

  const storedLang: Locale =
    typeof window === "undefined"
      ? DEFAULT_LOCALE
      : (() => {
          const stored = localStorage.getItem(LANG_KEY);
          return isLocale(stored) ? stored : DEFAULT_LOCALE;
        })();

  const lang = useMemo(() => {
    if (isLocale(queryLang)) {
      return queryLang;
    }
    return storedLang;
  }, [queryLang, storedLang]);

  useEffect(() => {
    if (isLocale(queryLang)) {
      localStorage.setItem(LANG_KEY, queryLang);
      return;
    }

    if (isLocale(storedLang)) {
      const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
      params.set("lang", storedLang);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname, queryLang, router, storedLang]);

  const switchLang = useCallback(
    (nextLang: Locale) => {
      localStorage.setItem(LANG_KEY, nextLang);
      const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
      params.set("lang", nextLang);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router],
  );

  const isZh = useMemo(() => lang === "zh", [lang]);

  return { lang, isZh, switchLang };
}
