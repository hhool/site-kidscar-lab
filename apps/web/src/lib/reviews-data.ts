/**
 * Reviews Data Model & Mock Data
 *
 * This file contains the Review data structure and mock data for testing.
 * Can be easily replaced with real API calls in Phase 2+.
 */

export type ReviewCategory = "balance-bike" | "tricycle" | "kids-bike" | "scooter";
export type ReviewAgeGroup = "2-3" | "3-5" | "5-7" | "7-10" | "10+";
export type ReviewPriceRange = "0-50" | "50-100" | "100-200" | "200-500" | "500+";
export type ReviewMetric = "safety" | "stability" | "comfort" | "durability" | "value";
export type ReviewSortBy = "latest" | "score" | "popularity";

export interface Review {
  id: string;
  title: { zh: string; en: string };
  productName: { zh: string; en: string };
  category: ReviewCategory;
  ageGroup: ReviewAgeGroup;
  priceRange: ReviewPriceRange;
  overallScore: number; // 0-10
  safetyScore: number;
  stabilityScore: number;
  comfortScore: number;
  durabilityScore: number;
  valueScore: number;
  summary: { zh: string; en: string };
  excerpt: { zh: string; en: string };
  testDate: string; // ISO date
  reviewVersion: string; // e.g. "v1.0"
  imageUrl?: string;
  featured?: boolean;
}

export const REVIEW_CATEGORIES: Record<ReviewCategory, { zh: string; en: string }> = {
  "balance-bike": { zh: "平衡车", en: "Balance Bike" },
  tricycle: { zh: "三轮车", en: "Tricycle" },
  "kids-bike": { zh: "儿童自行车", en: "Kids Bike" },
  scooter: { zh: "滑板车", en: "Scooter" },
};

export const REVIEW_AGE_GROUPS: Record<ReviewAgeGroup, { zh: string; en: string }> = {
  "2-3": { zh: "2-3 岁", en: "Age 2-3" },
  "3-5": { zh: "3-5 岁", en: "Age 3-5" },
  "5-7": { zh: "5-7 岁", en: "Age 5-7" },
  "7-10": { zh: "7-10 岁", en: "Age 7-10" },
  "10+": { zh: "10+ 岁", en: "Age 10+" },
};

export const REVIEW_PRICE_RANGES: Record<ReviewPriceRange, { zh: string; en: string }> = {
  "0-50": { zh: "$0-50", en: "$0-50" },
  "50-100": { zh: "$50-100", en: "$50-100" },
  "100-200": { zh: "$100-200", en: "$100-200" },
  "200-500": { zh: "$200-500", en: "$200-500" },
  "500+": { zh: "$500+", en: "$500+" },
};

export const REVIEW_METRICS: Record<ReviewMetric, { zh: string; en: string }> = {
  safety: { zh: "安全性", en: "Safety" },
  stability: { zh: "稳定性", en: "Stability" },
  comfort: { zh: "舒适度", en: "Comfort" },
  durability: { zh: "耐久性", en: "Durability" },
  value: { zh: "性价比", en: "Value" },
};

export const REVIEW_SORT_OPTIONS: Record<ReviewSortBy, { zh: string; en: string }> = {
  latest: { zh: "最新", en: "Latest" },
  score: { zh: "评分", en: "Score" },
  popularity: { zh: "热度", en: "Popularity" },
};

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: "review-001",
    title: { zh: "XYZ-2000 超级平衡车评测", en: "XYZ-2000 Super Balance Bike Review" },
    productName: { zh: "XYZ-2000 超级平衡车", en: "XYZ-2000 Super Balance Bike" },
    category: "balance-bike",
    ageGroup: "3-5",
    priceRange: "100-200",
    overallScore: 9.8,
    safetyScore: 10,
    stabilityScore: 9.5,
    comfortScore: 9.6,
    durabilityScore: 9.7,
    valueScore: 9.5,
    summary: { zh: "这款平衡车在安全性和稳定性上表现卓越。", en: "This balance bike excels in safety and stability." },
    excerpt: { zh: "经过100小时的测试，我们发现这款产品具有出色的制动性能...", en: "After 100 hours of testing, excellent braking performance..." },
    testDate: "2026-04-15",
    reviewVersion: "v2.1",
    featured: true,
  },
  {
    id: "review-002",
    title: { zh: "ABC-500 轻便平衡车", en: "ABC-500 Lightweight Balance Bike" },
    productName: { zh: "ABC-500 轻便款", en: "ABC-500 Lightweight" },
    category: "balance-bike",
    ageGroup: "2-3",
    priceRange: "50-100",
    overallScore: 8.9,
    safetyScore: 9.2,
    stabilityScore: 8.8,
    comfortScore: 8.7,
    durabilityScore: 8.5,
    valueScore: 9.4,
    summary: { zh: "性价比最优的平衡车选择。", en: "Best value balance bike." },
    excerpt: { zh: "这款车以其轻量级设计脱颖而出...", en: "Lightweight design stands out..." },
    testDate: "2026-04-10",
    reviewVersion: "v1.8",
  },
  {
    id: "review-003",
    title: { zh: "DEF-800 儿童自行车安全测试", en: "DEF-800 Kids Bike Safety Test" },
    productName: { zh: "DEF-800 全能型", en: "DEF-800 All-in-One" },
    category: "kids-bike",
    ageGroup: "5-7",
    priceRange: "100-200",
    overallScore: 9.3,
    safetyScore: 9.6,
    stabilityScore: 9.2,
    comfortScore: 9.1,
    durabilityScore: 9.3,
    valueScore: 8.9,
    summary: { zh: "全能型儿童自行车，安全性能达到国际标准。", en: "All-around kids bike with safety standards." },
    excerpt: { zh: "通过 ISO 8098 认证...", en: "Certified to ISO 8098..." },
    testDate: "2026-04-05",
    reviewVersion: "v2.0",
    featured: true,
  },
  {
    id: "review-004",
    title: { zh: "GHI-600 三轮车耐久性评测", en: "GHI-600 Tricycle Durability Test" },
    productName: { zh: "GHI-600 三轮车", en: "GHI-600 Tricycle" },
    category: "tricycle",
    ageGroup: "2-3",
    priceRange: "50-100",
    overallScore: 8.6,
    safetyScore: 9.1,
    stabilityScore: 9.3,
    comfortScore: 8.4,
    durabilityScore: 8.2,
    valueScore: 8.5,
    summary: { zh: "稳定性最强的三轮车。", en: "Most stable tricycle." },
    excerpt: { zh: "配备了双安全装置...", en: "Features dual safety systems..." },
    testDate: "2026-03-28",
    reviewVersion: "v1.5",
  },
  {
    id: "review-005",
    title: { zh: "JKL-950 高端儿童自行车评测", en: "JKL-950 Premium Kids Bike Review" },
    productName: { zh: "JKL-950 高端款", en: "JKL-950 Premium" },
    category: "kids-bike",
    ageGroup: "7-10",
    priceRange: "200-500",
    overallScore: 9.6,
    safetyScore: 9.8,
    stabilityScore: 9.5,
    comfortScore: 9.7,
    durabilityScore: 9.6,
    valueScore: 9.2,
    summary: { zh: "高端儿童自行车，各项性能均属顶级水平。", en: "Premium bike with top-tier performance." },
    excerpt: { zh: "采用航空级铝合金车架...", en: "Aviation-grade aluminum frame..." },
    testDate: "2026-03-20",
    reviewVersion: "v2.2",
    featured: true,
  },
  {
    id: "review-006",
    title: { zh: "MNO-300 儿童滑板车测试", en: "MNO-300 Kids Scooter Test" },
    productName: { zh: "MNO-300 滑板车", en: "MNO-300 Scooter" },
    category: "scooter",
    ageGroup: "3-5",
    priceRange: "0-50",
    overallScore: 8.2,
    safetyScore: 8.5,
    stabilityScore: 8.3,
    comfortScore: 7.9,
    durabilityScore: 8.1,
    valueScore: 8.8,
    summary: { zh: "入门级滑板车，性价比优秀。", en: "Beginner scooter with excellent value." },
    excerpt: { zh: "这款滑板车设计简洁...", en: "Simple design with easy control..." },
    testDate: "2026-03-15",
    reviewVersion: "v1.3",
  },
  {
    id: "review-007",
    title: { zh: "PQR-700 平衡车与自行车过渡产品", en: "PQR-700 Balance to Bike Transition" },
    productName: { zh: "PQR-700 过渡款", en: "PQR-700 Transition" },
    category: "balance-bike",
    ageGroup: "5-7",
    priceRange: "100-200",
    overallScore: 8.8,
    safetyScore: 9.0,
    stabilityScore: 8.9,
    comfortScore: 8.6,
    durabilityScore: 8.7,
    valueScore: 8.7,
    summary: { zh: "专为过渡期设计的混合产品。", en: "Hybrid transition product design." },
    excerpt: { zh: "可配置的脚踏和车架设计...", en: "Configurable pedals and frame..." },
    testDate: "2026-03-10",
    reviewVersion: "v1.9",
  },
  {
    id: "review-008",
    title: { zh: "STU-400 经济型三轮车", en: "STU-400 Budget Tricycle" },
    productName: { zh: "STU-400 经济款", en: "STU-400 Budget" },
    category: "tricycle",
    ageGroup: "3-5",
    priceRange: "0-50",
    overallScore: 7.9,
    safetyScore: 8.1,
    stabilityScore: 8.4,
    comfortScore: 7.6,
    durabilityScore: 7.7,
    valueScore: 8.9,
    summary: { zh: "入门级三轮车，性价比突出。", en: "Budget-friendly tricycle." },
    excerpt: { zh: "虽然价格便宜但性能出色...", en: "Great performance at low price..." },
    testDate: "2026-03-05",
    reviewVersion: "v1.0",
  },
];

/**
 * Filter & sort reviews based on criteria
 */
export function filterReviews(
  reviews: Review[],
  filters: {
    category?: ReviewCategory;
    ageGroup?: ReviewAgeGroup;
    priceRange?: ReviewPriceRange;
    metric?: ReviewMetric;
    sortBy?: ReviewSortBy;
  }
): Review[] {
  let filtered = [...reviews];

  if (filters.category) {
    filtered = filtered.filter((r) => r.category === filters.category);
  }

  if (filters.ageGroup) {
    filtered = filtered.filter((r) => r.ageGroup === filters.ageGroup);
  }

  if (filters.priceRange) {
    filtered = filtered.filter((r) => r.priceRange === filters.priceRange);
  }

  const sortBy = filters.sortBy || "latest";
  switch (sortBy) {
    case "score":
      filtered.sort((a, b) => b.overallScore - a.overallScore);
      break;
    case "popularity":
      filtered.sort((a, b) => b.overallScore - a.overallScore);
      break;
    case "latest":
    default:
      filtered.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
      break;
  }

  return filtered;
}
