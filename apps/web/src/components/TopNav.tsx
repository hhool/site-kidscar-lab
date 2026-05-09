"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { type Locale } from "@/lib/constants/locales";
import { ROUTES } from "@/lib/constants/routes";
import { useAppLang } from "@/components/useAppLang";

const AUTH_KEY = "kcl_auth";
const AUTH_EVENT = "kcl:auth-change";

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
  toggleAuthOn: { zh: "模拟登录", en: "Mock Login" },
  toggleAuthOff: { zh: "模拟退出", en: "Mock Logout" },
};

function pick(lang: Locale, value: { zh: string; en: string }) {
  return lang === "zh" ? value.zh : value.en;
}

function subscribeAuth(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => onStoreChange();
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function readClientAuthed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const authed = useSyncExternalStore(subscribeAuth, readClientAuthed, () => false);
  const { lang, switchLang } = useAppLang();

  const isActive = (href: string) => pathname === href;

  const toggleAuth = () => {
    const next = !authed;
    localStorage.setItem(AUTH_KEY, next ? "1" : "0");
    window.dispatchEvent(new Event(AUTH_EVENT));
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
          <button
            type="button"
            onClick={toggleAuth}
            className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700"
          >
            {authed ? pick(lang, text.toggleAuthOff) : pick(lang, text.toggleAuthOn)}
          </button>
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
                onClick={toggleAuth}
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-white"
              >
                {pick(lang, text.logout)}
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
                className={isActive(ROUTES.authLogin) ? "rounded-full bg-zinc-700 px-3 py-1.5 text-white" : "rounded-full bg-zinc-900 px-3 py-1.5 text-white"}
              >
                {pick(lang, text.login)}
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
              <button
                type="button"
                onClick={toggleAuth}
                className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700"
              >
                {authed ? pick(lang, text.toggleAuthOff) : pick(lang, text.toggleAuthOn)}
              </button>
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
                    onClick={toggleAuth}
                    className="rounded-full bg-zinc-900 px-3 py-1.5 text-white"
                  >
                    {pick(lang, text.logout)}
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
                    className="rounded-full bg-zinc-900 px-3 py-1.5 text-white"
                  >
                    {pick(lang, text.login)}
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
