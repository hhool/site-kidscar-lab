/**
 * Test Results Data
 *
 * Filterable database of test metrics per product.
 */

export type ResultMetric = "safety" | "stability" | "ease_of_use" | "durability" | "value";
export type ResultCategory = "balance-bike" | "tricycle" | "kids-bike" | "scooter";
export type ResultAgeGroup = "1-3" | "3-5" | "5-8" | "8-12";
export type ResultBrand = "XYZ" | "TotRide" | "SafeWheel" | "MiniGo" | "PedalPal";

export interface TestResultRow {
  id: string;
  productName: { zh: string; en: string };
  brand: ResultBrand;
  category: ResultCategory;
  ageGroup: ResultAgeGroup;
  testedDate: string;
  sampleSize: number;
  scores: Record<ResultMetric, number>;
  overallScore: number;
  methodVersion: string;
}

export const RESULT_METRIC_LABELS: Record<ResultMetric, { zh: string; en: string }> = {
  safety: { zh: "安全性", en: "Safety" },
  stability: { zh: "稳定性", en: "Stability" },
  ease_of_use: { zh: "易用性", en: "Ease of Use" },
  durability: { zh: "耐久性", en: "Durability" },
  value: { zh: "性价比", en: "Value" },
};

export const RESULT_CATEGORY_LABELS: Record<ResultCategory, { zh: string; en: string }> = {
  "balance-bike": { zh: "平衡车", en: "Balance Bike" },
  tricycle: { zh: "三轮车", en: "Tricycle" },
  "kids-bike": { zh: "儿童自行车", en: "Kids Bike" },
  scooter: { zh: "滑板车", en: "Scooter" },
};

export const RESULT_AGE_LABELS: Record<ResultAgeGroup, { zh: string; en: string }> = {
  "1-3": { zh: "1-3 岁", en: "Age 1-3" },
  "3-5": { zh: "3-5 岁", en: "Age 3-5" },
  "5-8": { zh: "5-8 岁", en: "Age 5-8" },
  "8-12": { zh: "8-12 岁", en: "Age 8-12" },
};

export const mockTestResults: TestResultRow[] = [
  {
    id: "tr-001",
    productName: { zh: "XYZ-2000 超级平衡车", en: "XYZ-2000 Super Balance Bike" },
    brand: "XYZ",
    category: "balance-bike",
    ageGroup: "3-5",
    testedDate: "2026-03-15",
    sampleSize: 12,
    scores: { safety: 10.0, stability: 9.8, ease_of_use: 9.5, durability: 9.7, value: 9.5 },
    overallScore: 9.8,
    methodVersion: "v2.1",
  },
  {
    id: "tr-002",
    productName: { zh: "TotRide Mini 三轮车", en: "TotRide Mini Tricycle" },
    brand: "TotRide",
    category: "tricycle",
    ageGroup: "1-3",
    testedDate: "2026-02-20",
    sampleSize: 10,
    scores: { safety: 9.5, stability: 9.2, ease_of_use: 9.8, durability: 8.9, value: 9.6 },
    overallScore: 9.4,
    methodVersion: "v2.0",
  },
  {
    id: "tr-003",
    productName: { zh: "SafeWheel Pro 儿童自行车", en: "SafeWheel Pro Kids Bike" },
    brand: "SafeWheel",
    category: "kids-bike",
    ageGroup: "5-8",
    testedDate: "2026-03-01",
    sampleSize: 8,
    scores: { safety: 9.2, stability: 9.0, ease_of_use: 8.8, durability: 9.3, value: 8.5 },
    overallScore: 9.0,
    methodVersion: "v2.1",
  },
  {
    id: "tr-004",
    productName: { zh: "MiniGo 轻量滑板车", en: "MiniGo Lightweight Scooter" },
    brand: "MiniGo",
    category: "scooter",
    ageGroup: "5-8",
    testedDate: "2026-01-25",
    sampleSize: 9,
    scores: { safety: 8.8, stability: 8.5, ease_of_use: 9.5, durability: 8.2, value: 9.8 },
    overallScore: 8.9,
    methodVersion: "v2.0",
  },
  {
    id: "tr-005",
    productName: { zh: "PedalPal 成长自行车", en: "PedalPal Growth Bike" },
    brand: "PedalPal",
    category: "kids-bike",
    ageGroup: "8-12",
    testedDate: "2026-04-10",
    sampleSize: 11,
    scores: { safety: 9.0, stability: 9.1, ease_of_use: 8.6, durability: 9.4, value: 8.7 },
    overallScore: 9.0,
    methodVersion: "v2.1",
  },
  {
    id: "tr-006",
    productName: { zh: "XYZ-1000 入门平衡车", en: "XYZ-1000 Starter Balance Bike" },
    brand: "XYZ",
    category: "balance-bike",
    ageGroup: "1-3",
    testedDate: "2026-02-05",
    sampleSize: 10,
    scores: { safety: 9.3, stability: 9.0, ease_of_use: 9.2, durability: 8.8, value: 9.7 },
    overallScore: 9.2,
    methodVersion: "v2.0",
  },
];

export const ALL_BRANDS: ResultBrand[] = ["XYZ", "TotRide", "SafeWheel", "MiniGo", "PedalPal"];
export const ALL_CATEGORIES: ResultCategory[] = ["balance-bike", "tricycle", "kids-bike", "scooter"];
export const ALL_AGE_GROUPS: ResultAgeGroup[] = ["1-3", "3-5", "5-8", "8-12"];
export const ALL_METRICS: ResultMetric[] = ["safety", "stability", "ease_of_use", "durability", "value"];
