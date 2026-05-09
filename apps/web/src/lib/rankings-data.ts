/**
 * Rankings Data Model & Mock Data
 *
 * Ranking state is controlled by URL param: ?type=
 */

export type RankingType = "overall" | "safety" | "value" | "comfort" | "durability";

export interface RankingItem {
  id: string;
  productName: { zh: string; en: string };
  category: { zh: string; en: string };
  priceRange: { zh: string; en: string };
  scores: {
    overall: number;
    safety: number;
    value: number;
    comfort: number;
    durability: number;
  };
  badges: { zh: string; en: string }[];
  highlight: { zh: string; en: string };
  featured?: boolean;
}

export const RANKING_TYPES: Record<RankingType, { zh: string; en: string }> = {
  overall: { zh: "综合分", en: "Overall" },
  safety: { zh: "安全性", en: "Safety" },
  value: { zh: "性价比", en: "Value" },
  comfort: { zh: "舒适度", en: "Comfort" },
  durability: { zh: "耐久性", en: "Durability" },
};

export const mockRankingItems: RankingItem[] = [
  {
    id: "rk-001",
    productName: { zh: "XYZ-2000 超级平衡车", en: "XYZ-2000 Super Balance Bike" },
    category: { zh: "平衡车", en: "Balance Bike" },
    priceRange: { zh: "$100-200", en: "$100-200" },
    scores: { overall: 9.8, safety: 10.0, value: 9.5, comfort: 9.6, durability: 9.7 },
    badges: [{ zh: "编辑推荐", en: "Editor Pick" }, { zh: "测试冠军", en: "Test Winner" }],
    highlight: { zh: "在刹车距离和低速稳定性测试中表现最佳。", en: "Best-in-class braking distance and low-speed stability." },
    featured: true,
  },
  {
    id: "rk-002",
    productName: { zh: "JKL-950 高端儿童自行车", en: "JKL-950 Premium Kids Bike" },
    category: { zh: "儿童自行车", en: "Kids Bike" },
    priceRange: { zh: "$200-500", en: "$200-500" },
    scores: { overall: 9.6, safety: 9.8, value: 9.2, comfort: 9.7, durability: 9.6 },
    badges: [{ zh: "高端之选", en: "Premium Choice" }],
    highlight: { zh: "长距离舒适度与车架强度均达到顶级。", en: "Top-tier long-ride comfort and frame rigidity." },
    featured: true,
  },
  {
    id: "rk-003",
    productName: { zh: "DEF-800 全能型", en: "DEF-800 All-in-One" },
    category: { zh: "儿童自行车", en: "Kids Bike" },
    priceRange: { zh: "$100-200", en: "$100-200" },
    scores: { overall: 9.3, safety: 9.6, value: 8.9, comfort: 9.1, durability: 9.3 },
    badges: [{ zh: "均衡表现", en: "Balanced Performer" }],
    highlight: { zh: "综合成绩稳定，适合多数家庭。", en: "Consistent all-around performance for most families." },
  },
  {
    id: "rk-004",
    productName: { zh: "ABC-500 轻便款", en: "ABC-500 Lightweight" },
    category: { zh: "平衡车", en: "Balance Bike" },
    priceRange: { zh: "$50-100", en: "$50-100" },
    scores: { overall: 8.9, safety: 9.2, value: 9.4, comfort: 8.7, durability: 8.5 },
    badges: [{ zh: "预算友好", en: "Budget Friendly" }],
    highlight: { zh: "在 100 美元内有最优性价比。", en: "Best value under 100 dollars." },
  },
  {
    id: "rk-005",
    productName: { zh: "PQR-700 过渡款", en: "PQR-700 Transition" },
    category: { zh: "平衡车", en: "Balance Bike" },
    priceRange: { zh: "$100-200", en: "$100-200" },
    scores: { overall: 8.8, safety: 9.0, value: 8.7, comfort: 8.6, durability: 8.7 },
    badges: [{ zh: "过渡推荐", en: "Transition Pick" }],
    highlight: { zh: "适合从平衡车过渡到脚踏车的阶段。", en: "Great for transition from balance to pedal bike." },
  },
  {
    id: "rk-006",
    productName: { zh: "GHI-600 三轮车", en: "GHI-600 Tricycle" },
    category: { zh: "三轮车", en: "Tricycle" },
    priceRange: { zh: "$50-100", en: "$50-100" },
    scores: { overall: 8.6, safety: 9.1, value: 8.5, comfort: 8.4, durability: 8.2 },
    badges: [{ zh: "稳定首选", en: "Stability Pick" }],
    highlight: { zh: "侧翻控制和静态稳定性表现优秀。", en: "Excellent rollover control and static stability." },
  },
  {
    id: "rk-007",
    productName: { zh: "MNO-300 滑板车", en: "MNO-300 Scooter" },
    category: { zh: "滑板车", en: "Scooter" },
    priceRange: { zh: "$0-50", en: "$0-50" },
    scores: { overall: 8.2, safety: 8.5, value: 8.8, comfort: 7.9, durability: 8.1 },
    badges: [{ zh: "入门推荐", en: "Beginner Pick" }],
    highlight: { zh: "低预算场景中综合表现可靠。", en: "Reliable option for low-budget scenarios." },
  },
  {
    id: "rk-008",
    productName: { zh: "STU-400 经济款", en: "STU-400 Budget" },
    category: { zh: "三轮车", en: "Tricycle" },
    priceRange: { zh: "$0-50", en: "$0-50" },
    scores: { overall: 7.9, safety: 8.1, value: 8.9, comfort: 7.6, durability: 7.7 },
    badges: [{ zh: "经济型", en: "Economy" }],
    highlight: { zh: "在入门价位段具备良好价值。", en: "Strong value in the entry-level segment." },
  },
];

export function getScoreByType(item: RankingItem, type: RankingType): number {
  return item.scores[type];
}

export function getRankingsByType(type: RankingType): Array<RankingItem & { rank: number }> {
  const sorted = [...mockRankingItems].sort((a, b) => getScoreByType(b, type) - getScoreByType(a, type));
  return sorted.map((item, index) => ({ ...item, rank: index + 1 }));
}
