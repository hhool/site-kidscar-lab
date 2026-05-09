"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/lib/constants/routes";

const mainLinks = [
  { href: ROUTES.products, label: "产品" },
  { href: ROUTES.reviews, label: "评测" },
  { href: ROUTES.rankings, label: "排名" },
  { href: ROUTES.news, label: "资讯" },
  { href: ROUTES.about, label: "关于" },
];

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href={ROUTES.home} className="font-semibold tracking-tight text-zinc-900">
          KidsCarLab
        </Link>
        <nav className="hidden gap-5 text-sm text-zinc-700 md:flex">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "font-medium text-zinc-900" : "hover:text-zinc-900"}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 text-sm md:flex">
          <Link
            href={ROUTES.authRegister}
            className={isActive(ROUTES.authRegister) ? "rounded-full border border-zinc-900 px-3 py-1.5 text-zinc-900" : "rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-800"}
          >
            注册
          </Link>
          <Link
            href={ROUTES.authLogin}
            className={isActive(ROUTES.authLogin) ? "rounded-full bg-zinc-700 px-3 py-1.5 text-white" : "rounded-full bg-zinc-900 px-3 py-1.5 text-white"}
          >
            登录
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-md border border-zinc-300 px-3 text-sm text-zinc-700 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="切换导航菜单"
        >
          菜单
        </button>
      </div>
      {open ? (
        <div className="border-t border-zinc-200 bg-white md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 text-sm text-zinc-700">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={isActive(link.href) ? "rounded-md bg-zinc-100 px-2 py-2 font-medium text-zinc-900" : "rounded-md px-2 py-2 hover:bg-zinc-100"}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link
                href={ROUTES.authRegister}
                onClick={() => setOpen(false)}
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-800"
              >
                注册
              </Link>
              <Link
                href={ROUTES.authLogin}
                onClick={() => setOpen(false)}
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-white"
              >
                登录
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
