/**
 * Products Data Model & Mock Data
 *
 * Product list state is controlled by URL params:
 * - category
 * - price
 * - q
 */

export type ProductCategory = "balance-bike" | "tricycle" | "kids-bike" | "scooter";
export type ProductPriceRange = "0-50" | "50-100" | "100-200" | "200-500" | "500+";
export type ProductSortBy = "featured" | "price-asc" | "price-desc";

export interface ProductItem {
  id: string;
  name: { zh: string; en: string };
  category: ProductCategory;
  ageGroup: { zh: string; en: string };
  priceRange: ProductPriceRange;
  priceValue: number;
  rating: number;
  tags: { zh: string; en: string }[];
  summary: { zh: string; en: string };
  featured?: boolean;
}

export const PRODUCT_CATEGORIES: Record<ProductCategory, { zh: string; en: string }> = {
  "balance-bike": { zh: "平衡车", en: "Balance Bike" },
  tricycle: { zh: "三轮车", en: "Tricycle" },
  "kids-bike": { zh: "儿童自行车", en: "Kids Bike" },
  scooter: { zh: "滑板车", en: "Scooter" },
};

export const PRODUCT_PRICE_RANGES: Record<ProductPriceRange, { zh: string; en: string }> = {
  "0-50": { zh: "$0-50", en: "$0-50" },
  "50-100": { zh: "$50-100", en: "$50-100" },
  "100-200": { zh: "$100-200", en: "$100-200" },
  "200-500": { zh: "$200-500", en: "$200-500" },
  "500+": { zh: "$500+", en: "$500+" },
};

export const PRODUCT_SORT_OPTIONS: Record<ProductSortBy, { zh: string; en: string }> = {
  featured: { zh: "推荐优先", en: "Featured" },
  "price-asc": { zh: "价格升序", en: "Price: Low to High" },
  "price-desc": { zh: "价格降序", en: "Price: High to Low" },
};

export const mockProducts: ProductItem[] = [
  {
    id: "pd-001",
    name: { zh: "XYZ-2000 超级平衡车", en: "XYZ-2000 Super Balance Bike" },
    category: "balance-bike",
    ageGroup: { zh: "3-5 岁", en: "Age 3-5" },
    priceRange: "100-200",
    priceValue: 169,
    rating: 9.8,
    tags: [{ zh: "编辑推荐", en: "Editor Pick" }, { zh: "高安全", en: "High Safety" }],
    summary: { zh: "旗舰级平衡车，稳定与安全兼顾。", en: "Flagship balance bike with strong stability and safety." },
    featured: true,
  },
  {
    id: "pd-002",
    name: { zh: "ABC-500 轻便款", en: "ABC-500 Lightweight" },
    category: "balance-bike",
    ageGroup: { zh: "2-3 岁", en: "Age 2-3" },
    priceRange: "50-100",
    priceValue: 79,
    rating: 8.9,
    tags: [{ zh: "预算友好", en: "Budget Friendly" }],
    summary: { zh: "轻量化设计，适合低龄儿童入门。", en: "Lightweight starter option for younger kids." },
  },
  {
    id: "pd-003",
    name: { zh: "DEF-800 全能型", en: "DEF-800 All-in-One" },
    category: "kids-bike",
    ageGroup: { zh: "5-7 岁", en: "Age 5-7" },
    priceRange: "100-200",
    priceValue: 189,
    rating: 9.3,
    tags: [{ zh: "综合均衡", en: "Balanced" }],
    summary: { zh: "通过多项安全测试的全能车型。", en: "All-around bike with solid safety test results." },
  },
  {
    id: "pd-004",
    name: { zh: "GHI-600 三轮车", en: "GHI-600 Tricycle" },
    category: "tricycle",
    ageGroup: { zh: "2-3 岁", en: "Age 2-3" },
    priceRange: "50-100",
    priceValue: 69,
    rating: 8.6,
    tags: [{ zh: "稳定首选", en: "Stability Pick" }],
    summary: { zh: "抗侧翻能力优秀，适合新手。", en: "Strong anti-roll behavior for beginners." },
  },
  {
    id: "pd-005",
    name: { zh: "JKL-950 高端儿童自行车", en: "JKL-950 Premium Kids Bike" },
    category: "kids-bike",
    ageGroup: { zh: "7-10 岁", en: "Age 7-10" },
    priceRange: "200-500",
    priceValue: 329,
    rating: 9.6,
    tags: [{ zh: "高端之选", en: "Premium Choice" }],
    summary: { zh: "高端配置，舒适度和耐久性突出。", en: "Premium setup with standout comfort and durability." },
    featured: true,
  },
  {
    id: "pd-006",
    name: { zh: "MNO-300 滑板车", en: "MNO-300 Scooter" },
    category: "scooter",
    ageGroup: { zh: "3-5 岁", en: "Age 3-5" },
    priceRange: "0-50",
    priceValue: 45,
    rating: 8.2,
    tags: [{ zh: "入门推荐", en: "Beginner" }],
    summary: { zh: "基础功能完善，适合初次尝试。", en: "Good basic feature set for first-time riders." },
  },
  {
    id: "pd-007",
    name: { zh: "PQR-700 过渡款", en: "PQR-700 Transition" },
    category: "balance-bike",
    ageGroup: { zh: "5-7 岁", en: "Age 5-7" },
    priceRange: "100-200",
    priceValue: 149,
    rating: 8.8,
    tags: [{ zh: "过渡推荐", en: "Transition Pick" }],
    summary: { zh: "专为从平衡车过渡到脚踏车阶段设计。", en: "Designed for transition from balance to pedal bikes." },
  },
  {
    id: "pd-008",
    name: { zh: "STU-400 经济款三轮车", en: "STU-400 Budget Tricycle" },
    category: "tricycle",
    ageGroup: { zh: "3-5 岁", en: "Age 3-5" },
    priceRange: "0-50",
    priceValue: 39,
    rating: 7.9,
    tags: [{ zh: "经济型", en: "Economy" }],
    summary: { zh: "价格友好，日常代步足够。", en: "Affordable and good enough for daily short rides." },
  },
];

export function filterProducts(
  products: ProductItem[],
  filters: {
    category?: ProductCategory;
    priceRange?: ProductPriceRange;
    query?: string;
    sortBy?: ProductSortBy;
  }
): ProductItem[] {
  let filtered = [...products];

  if (filters.category) {
    filtered = filtered.filter((item) => item.category === filters.category);
  }

  if (filters.priceRange) {
    filtered = filtered.filter((item) => item.priceRange === filters.priceRange);
  }

  if (filters.query) {
    const q = filters.query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((item) => {
        const searchText = `${item.name.zh} ${item.name.en} ${item.summary.zh} ${item.summary.en}`.toLowerCase();
        return searchText.includes(q);
      });
    }
  }

  const sortBy = filters.sortBy || "featured";
  switch (sortBy) {
    case "price-asc":
      filtered.sort((a, b) => a.priceValue - b.priceValue);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.priceValue - a.priceValue);
      break;
    case "featured":
    default:
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
      break;
  }

  return filtered;
}
