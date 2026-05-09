/**
 * Methodology Data
 *
 * Covers: test process, metric definitions, scoring rules, version history.
 */

export interface MetricDefinition {
  id: string;
  name: { zh: string; en: string };
  unit: { zh: string; en: string };
  description: { zh: string; en: string };
  scoreRange: string;
}

export interface ProcessStep {
  step: number;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
}

export interface VersionEntry {
  version: string;
  date: string;
  changes: { zh: string; en: string }[];
}

export const TEST_PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: { zh: "产品获取", en: "Product Acquisition" },
    description: {
      zh: "我们通过自费购买或厂商无偿提供的方式获取测试产品，并公开披露来源。",
      en: "We acquire products via self-purchase or manufacturer-provided samples, with source disclosed publicly.",
    },
  },
  {
    step: 2,
    title: { zh: "标准化测试环境", en: "Standardized Test Environment" },
    description: {
      zh: "所有产品在相同场地、相同气候条件下进行测试，测试人员体重与年龄段统一。",
      en: "All products are tested on the same surface and climate conditions, with standardized rider weight and age group.",
    },
  },
  {
    step: 3,
    title: { zh: "多维度打分", en: "Multi-Dimension Scoring" },
    description: {
      zh: "每款产品按安全性、稳定性、易用性、耐久性、性价比等5个维度独立打分，综合分由加权平均计算。",
      en: "Each product is scored independently on Safety, Stability, Ease of Use, Durability, and Value — overall score is weighted average.",
    },
  },
  {
    step: 4,
    title: { zh: "双盲交叉审核", en: "Double-Blind Cross Review" },
    description: {
      zh: "初评与复评由不同评测员独立完成，差异超过 1 分时进行第三方仲裁。",
      en: "Initial and secondary scoring are done by different reviewers independently; gaps >1pt trigger third-party arbitration.",
    },
  },
  {
    step: 5,
    title: { zh: "结果公开发布", en: "Public Results Publication" },
    description: {
      zh: "测试数据与原始记录可通过测试结果数据库页面公开查阅，版本迭代均留存历史记录。",
      en: "Test data and raw records are accessible via the Test Results database. All version iterations are archived.",
    },
  },
];

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    id: "safety",
    name: { zh: "安全性", en: "Safety" },
    unit: { zh: "分（0-10）", en: "Score (0-10)" },
    description: {
      zh: "含结构稳定性、制动效能、边缘倒角处理、材料无毒认证等子项。",
      en: "Includes structural stability, braking efficiency, edge rounding, and non-toxic material certification.",
    },
    scoreRange: "0–10",
  },
  {
    id: "stability",
    name: { zh: "稳定性", en: "Stability" },
    unit: { zh: "分（0-10）", en: "Score (0-10)" },
    description: {
      zh: "衡量直线行驶偏差、侧向倾斜阈值与低速稳定保持时长。",
      en: "Measures straight-line deviation, lateral tilt threshold, and low-speed stability hold duration.",
    },
    scoreRange: "0–10",
  },
  {
    id: "ease_of_use",
    name: { zh: "易用性", en: "Ease of Use" },
    unit: { zh: "分（0-10）", en: "Score (0-10)" },
    description: {
      zh: "包含上下车便利性、把手调节范围、脚踏高度适配与组装难度。",
      en: "Covers mount/dismount ease, handlebar adjustment range, footrest height compatibility, and assembly complexity.",
    },
    scoreRange: "0–10",
  },
  {
    id: "durability",
    name: { zh: "耐久性", en: "Durability" },
    unit: { zh: "分（0-10）", en: "Score (0-10)" },
    description: {
      zh: "模拟 500 小时使用后的框架形变、涂层脱落率和关键连接件松动情况。",
      en: "Simulates 500-hour use; measures frame deformation, coating peel rate, and key joint loosening.",
    },
    scoreRange: "0–10",
  },
  {
    id: "value",
    name: { zh: "性价比", en: "Value" },
    unit: { zh: "分（0-10）", en: "Score (0-10)" },
    description: {
      zh: "综合评分与市场售价的比值，参考同品类均价基线计算。",
      en: "Ratio of overall score to market price, benchmarked against category average pricing.",
    },
    scoreRange: "0–10",
  },
];

export const SCORING_RULES: { title: { zh: string; en: string }; body: { zh: string; en: string } }[] = [
  {
    title: { zh: "加权平均公式", en: "Weighted Average Formula" },
    body: {
      zh: "综合分 = 安全性×0.30 + 稳定性×0.20 + 易用性×0.20 + 耐久性×0.15 + 性价比×0.15",
      en: "Overall = Safety×0.30 + Stability×0.20 + Ease×0.20 + Durability×0.15 + Value×0.15",
    },
  },
  {
    title: { zh: "分数更新规则", en: "Score Update Rules" },
    body: {
      zh: "产品版本更新、价格大幅变动（>15%）或市场均价基线调整时自动触发重评。",
      en: "Re-evaluation is triggered on product version updates, major price changes (>15%), or category baseline shifts.",
    },
  },
  {
    title: { zh: "评测员资质", en: "Reviewer Qualification" },
    body: {
      zh: "所有评测员须完成内部认证培训（儿童产品安全标准、人体工学基础），每年更新资质。",
      en: "All reviewers must complete internal certification (child product safety standards, ergonomics basics), renewed annually.",
    },
  },
];

export const VERSION_HISTORY: VersionEntry[] = [
  {
    version: "v2.1",
    date: "2026-04-15",
    changes: [
      { zh: "将耐久性测试时长从 300 小时提升至 500 小时", en: "Increased durability test duration from 300h to 500h" },
      { zh: "新增材料无毒认证作为安全性子项", en: "Added non-toxic material certification as a Safety sub-metric" },
    ],
  },
  {
    version: "v2.0",
    date: "2026-01-10",
    changes: [
      { zh: "重构评分公式，增加性价比独立维度", en: "Refactored scoring formula; added Value as a standalone dimension" },
      { zh: "引入双盲交叉审核机制", en: "Introduced double-blind cross-review mechanism" },
    ],
  },
  {
    version: "v1.0",
    date: "2025-06-01",
    changes: [
      { zh: "初版测试方法发布", en: "Initial methodology published" },
    ],
  },
];
