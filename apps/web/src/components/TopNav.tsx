"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type Locale } from "@/lib/constants/locales";
import { ROUTES } from "@/lib/constants/routes";
import { useAppLang } from "@/components/useAppLang";
import { AUTH_EVENT, AUTH_SYNC_KEY, emitAuthChange } from "@/lib/auth-sync";

type NavUser = {
  id: string;
  name: string;
  email: string;
};

const mainLinks = [
  {
    href: ROUTES.products,
    label: { zh: "产品", en: "Products" },
  },
  {
    href: ROUTES.reviews,
    label: { zh: "评测", en: "Reviews" },
  },
  {
    href: ROUTES.rankings,
    label: { zh: "排名", en: "Rankings" },
  },
  {
    href: ROUTES.news,
    label: { zh: "资讯", en: "News" },
  },
  {
    href: ROUTES.about,
    label: { zh: "关于", en: "About" },
  },
];

const text = {
  brand: { zh: "KidsCarLab", en: "KidsCarLab" },
  register: { zh: "注册", en: "Register" },
  login: { zh: "登录", en: "Login" },
  account: { zh: "用户中心", en: "Account" },
  logout: { zh: "退出", en: "Logout" },
  menu: { zh: "菜单", en: "Menu" },
  loading: { zh: "检测中", en: "Checking" },
};

function pick(lang: Locale, value: { zh: string; en: string }) {
  return lang === "zh" ? value.zh : value.en;
}

function pickWithFallback(lang: Locale, value: { zh: string; en: string }, fallback: string) {
  const selected = pick(lang, value).trim();
  return selected.length > 0 ? selected : fallback;
}

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<NavUser | null>(null);
  const { lang, switchLang } = useAppLang();

  const isActive = (href: string) => pathname === href;

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await response.json()) as { authed?: boolean; user?: NavUser | null };
      setUser(data.authed ? data.user || null : null);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      void refreshSession();
    }, 0);

    const handler = () => {
      setAuthLoading(true);
      void refreshSession();
    };

    const storageHandler = (event: StorageEvent) => {
      if (event.key === AUTH_SYNC_KEY) {
        setAuthLoading(true);
        void refreshSession();
      }
    };

    window.addEventListener(AUTH_EVENT, handler);
    window.addEventListener("storage", storageHandler);

    return () => {
      window.clearTimeout(initialTimer);
      window.removeEventListener(AUTH_EVENT, handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [refreshSession]);

  const authed = Boolean(user);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    emitAuthChange();
  };

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href={ROUTES.home} className="font-semibold tracking-tight text-zinc-900">
          {pick(lang, text.brand)}
        </Link>
        <nav className="hidden gap-5 text-sm text-zinc-700 md:flex">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "font-medium text-zinc-900" : "hover:text-zinc-900"}
            >
              {pick(lang, link.label)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 text-sm md:flex">
          <button
            type="button"
            onClick={() => switchLang(lang === "zh" ? "en" : "zh")}
            className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700"
          >
            {lang === "zh" ? "EN" : "中"}
          </button>
          {authLoading ? <span className="text-xs text-zinc-500">{pick(lang, text.loading)}...</span> : null}
          {authed ? (
            <>
              <Link
                href={ROUTES.account}
                className={isActive(ROUTES.account) ? "rounded-full border border-zinc-900 px-3 py-1.5 text-zinc-900" : "rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-800"}
              >
                {pick(lang, text.account)}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex min-w-[5.5rem] items-center justify-center rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white"
              >
                {pickWithFallback(lang, text.logout, "Logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.authRegister}
                className={isActive(ROUTES.authRegister) ? "rounded-full border border-zinc-900 px-3 py-1.5 text-zinc-900" : "rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-800"}
              >
                {pick(lang, text.register)}
              </Link>
              <Link
                href={ROUTES.authLogin}
                className={isActive(ROUTES.authLogin)
                  ? "inline-flex min-w-[5.5rem] items-center justify-center rounded-full bg-zinc-700 px-3 py-1.5 font-medium text-white"
                  : "inline-flex min-w-[5.5rem] items-center justify-center rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white"}
              >
                {pickWithFallback(lang, text.login, "Login")}
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-md border border-zinc-300 px-3 text-sm text-zinc-700 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={pick(lang, text.menu)}
        >
          {pick(lang, text.menu)}
        </button>
      </div>
      {open ? (
        <div className="border-t border-zinc-200 bg-white md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 text-sm text-zinc-700">
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={() => switchLang(lang === "zh" ? "en" : "zh")}
                className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700"
              >
                {lang === "zh" ? "EN" : "中"}
              </button>
              {authLoading ? <span className="self-center text-xs text-zinc-500">{pick(lang, text.loading)}...</span> : null}
            </div>
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={isActive(link.href) ? "rounded-md bg-zinc-100 px-2 py-2 font-medium text-zinc-900" : "rounded-md px-2 py-2 hover:bg-zinc-100"}
              >
                {pick(lang, link.label)}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {authed ? (
                <>
                  <Link
                    href={ROUTES.account}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-800"
                  >
                    {pick(lang, text.account)}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex min-w-[5.5rem] items-center justify-center rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white"
                  >
                    {pickWithFallback(lang, text.logout, "Logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.authRegister}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-800"
                  >
                    {pick(lang, text.register)}
                  </Link>
                  <Link
                    href={ROUTES.authLogin}
                    onClick={() => setOpen(false)}
                    className="inline-flex min-w-[5.5rem] items-center justify-center rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white"
                  >
                    {pickWithFallback(lang, text.login, "Login")}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
