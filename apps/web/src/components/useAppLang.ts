"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/constants/locales";

const LANG_KEY = "kcl_lang";
const LANG_EVENT = "kcl:lang-change";

function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value);
}

function readClientLang(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const query = new URLSearchParams(window.location.search).get("lang");
  if (isLocale(query)) {
    return query;
  }

  const stored = localStorage.getItem(LANG_KEY);
  if (isLocale(stored)) {
    return stored;
  }

  return DEFAULT_LOCALE;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => onStoreChange();
  window.addEventListener("popstate", handler);
  window.addEventListener(LANG_EVENT, handler);

  return () => {
    window.removeEventListener("popstate", handler);
    window.removeEventListener(LANG_EVENT, handler);
  };
}

export function useAppLang() {
  const lang = useSyncExternalStore(subscribe, readClientLang, () => DEFAULT_LOCALE);

  const switchLang = useCallback(
    (nextLang: Locale) => {
      if (typeof window === "undefined") {
        return;
      }

      localStorage.setItem(LANG_KEY, nextLang);
      const params = new URLSearchParams(window.location.search);
      params.set("lang", nextLang);
      const nextUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(window.history.state, "", nextUrl);
      window.dispatchEvent(new Event(LANG_EVENT));
    },
    [],
  );

  const isZh = lang === "zh";

  return { lang, isZh, switchLang };
}
