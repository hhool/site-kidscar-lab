/**
 * Brands & Models Data
 */

export type BrandOrigin = "CN" | "DE" | "US" | "JP" | "KR";

export interface BrandModel {
  id: string;
  name: { zh: string; en: string };
  category: string;
  priceValue: number;
  overallScore: number;
}

export interface BrandProfile {
  id: string;
  slug: string;
  name: string;
  logo: string; // initials placeholder
  origin: BrandOrigin;
  founded: number;
  description: { zh: string; en: string };
  certifications: string[];
  models: BrandModel[];
  avgScore: number;
}

export const ORIGIN_LABELS: Record<BrandOrigin, { zh: string; en: string }> = {
  CN: { zh: "中国", en: "China" },
  DE: { zh: "德国", en: "Germany" },
  US: { zh: "美国", en: "USA" },
  JP: { zh: "日本", en: "Japan" },
  KR: { zh: "韩国", en: "Korea" },
};

export const mockBrands: BrandProfile[] = [
  {
    id: "b-001", slug: "xyz",
    name: "XYZ", logo: "XY",
    origin: "CN", founded: 2012,
    description: {
      zh: "专注儿童平衡车与自行车的国内领先品牌，旗舰产品连续三年获 KidsCarLab 安全性满分。",
      en: "China's leading kids balance bike and bicycle brand. Flagship products have scored 10/10 on safety for three consecutive years.",
    },
    certifications: ["GB 6675-2014", "CE EN 71", "ISO 8098"],
    avgScore: 9.5,
    models: [
      { id: "xyz-2000", name: { zh: "XYZ-2000 超级平衡车", en: "XYZ-2000 Super Balance Bike" }, category: "balance-bike", priceValue: 169, overallScore: 9.8 },
      { id: "xyz-1000", name: { zh: "XYZ-1000 入门平衡车", en: "XYZ-1000 Starter Balance Bike" }, category: "balance-bike", priceValue: 89, overallScore: 9.2 },
    ],
  },
  {
    id: "b-002", slug: "totride",
    name: "TotRide", logo: "TR",
    origin: "DE", founded: 1998,
    description: {
      zh: "德国品牌，以欧洲儿童工程学标准设计，专攻 1-5 岁低幼童车市场，全系获 TÜV 认证。",
      en: "German brand engineering products to European child ergonomics standards. Focused on the 1-5 age range, with full TÜV certification across the lineup.",
    },
    certifications: ["TÜV SÜD", "CE EN 71", "DIN EN 8098"],
    avgScore: 9.4,
    models: [
      { id: "tr-mini", name: { zh: "TotRide Mini 三轮车", en: "TotRide Mini Tricycle" }, category: "tricycle", priceValue: 129, overallScore: 9.4 },
    ],
  },
  {
    id: "b-003", slug: "safewheel",
    name: "SafeWheel", logo: "SW",
    origin: "US", founded: 2008,
    description: {
      zh: "美国安全工程师团队创立，主打高安全性儿童自行车，每款产品均通过 ASTM 与 CPSC 双重认证。",
      en: "Founded by US safety engineers. Specializes in high-safety kids bikes, with every product dual-certified by ASTM and CPSC.",
    },
    certifications: ["ASTM F2711", "CPSC 16 CFR", "CE EN 71"],
    avgScore: 9.0,
    models: [
      { id: "sw-pro", name: { zh: "SafeWheel Pro 儿童自行车", en: "SafeWheel Pro Kids Bike" }, category: "kids-bike", priceValue: 219, overallScore: 9.0 },
    ],
  },
  {
    id: "b-004", slug: "minigo",
    name: "MiniGo", logo: "MG",
    origin: "CN", founded: 2016,
    description: {
      zh: "主打轻量化设计的国内新锐品牌，滑板车产品以高性价比著称，深受学龄前家长青睐。",
      en: "A domestic emerging brand focused on lightweight design. Known for high-value scooters, widely popular with pre-school parents.",
    },
    certifications: ["GB 6675-2014", "3C 认证"],
    avgScore: 8.9,
    models: [
      { id: "mg-lite", name: { zh: "MiniGo 轻量滑板车", en: "MiniGo Lightweight Scooter" }, category: "scooter", priceValue: 79, overallScore: 8.9 },
    ],
  },
  {
    id: "b-005", slug: "pedalpal",
    name: "PedalPal", logo: "PP",
    origin: "JP", founded: 2004,
    description: {
      zh: "日本品牌，以精工制造与可调节成长车架著称，适合 5-12 岁长期使用，注重骑行效率与材料品质。",
      en: "Japanese brand known for precision manufacturing and adjustable growth frames. Designed for 5-12 year-olds with long-term use in mind.",
    },
    certifications: ["JIS D 9301", "CE EN 14764", "SGS"],
    avgScore: 9.0,
    models: [
      { id: "pp-growth", name: { zh: "PedalPal 成长自行车", en: "PedalPal Growth Bike" }, category: "kids-bike", priceValue: 249, overallScore: 9.0 },
    ],
  },
];
