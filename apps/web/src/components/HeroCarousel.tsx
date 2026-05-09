"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppLang } from "./useAppLang";
import { ROUTES } from "@/lib/constants/routes";

interface CarouselSlide {
  id: string;
  title: { zh: string; en: string };
  subtitle: { zh: string; en: string };
  cta: { zh: string; en: string };
  href: string;
  bgColor: string;
}

const slides: CarouselSlide[] = [
  {
    id: "slide-1",
    title: { zh: "2026 年度最佳童车评测", en: "2026 Best Kids Bikes & Trikes" },
    subtitle: {
      zh: "基于 100+ 款产品的独立评测与排名",
      en: "Independent tests and rankings of 100+ products",
    },
    cta: { zh: "查看评测", en: "View Reviews" },
    href: ROUTES.reviews,
    bgColor: "from-blue-500 to-blue-600",
  },
  {
    id: "slide-2",
    title: { zh: "安全性排名 TOP 10", en: "Safety Rankings TOP 10" },
    subtitle: {
      zh: "严格的安全指标体系，确保每一次骑行都有保障",
      en: "Rigorous safety metrics ensure every ride is protected",
    },
    cta: { zh: "查看排名", en: "View Rankings" },
    href: ROUTES.rankings,
    bgColor: "from-green-500 to-green-600",
  },
  {
    id: "slide-3",
    title: { zh: "性价比指南", en: "Value for Money Guide" },
    subtitle: {
      zh: "优质产品不一定贵，帮你找到最适合的选择",
      en: "Quality doesn't always mean expensive – find your perfect match",
    },
    cta: { zh: "了解更多", en: "Learn More" },
    href: ROUTES.products,
    bgColor: "from-purple-500 to-purple-600",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { isZh } = useAppLang();

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    setIsAutoPlay(false);
  };

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 sm:h-96">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className={`h-full w-full bg-gradient-to-r ${s.bgColor} p-6 sm:p-8 lg:p-12`}>
              <div className="flex h-full flex-col justify-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  {isZh ? s.title.zh : s.title.en}
                </h2>
                <p className="mt-3 max-w-2xl text-lg text-white/90">
                  {isZh ? s.subtitle.zh : s.subtitle.en}
                </p>
                <div className="mt-6">
                  <Link
                    href={s.href}
                    className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    {isZh ? s.cta.zh : s.cta.en}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Auto-play toggle (small indicator) */}
      <div className="absolute top-4 right-4 text-xs text-white/70">
        {isAutoPlay ? (
          <span>Auto ▶</span>
        ) : (
          <button
            onClick={() => setIsAutoPlay(true)}
            className="rounded bg-white/20 px-2 py-1 hover:bg-white/30"
          >
            Resume
          </button>
        )}
      </div>
    </div>
  );
}
