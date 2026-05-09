/**
 * News / Updates Data
 */

export type NewsCategory = "industry" | "release" | "event" | "transparency" | "media";

export interface NewsItem {
  id: string;
  slug: string;
  category: NewsCategory;
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
  source: { zh: string; en: string };
  date: string;
  tags: { zh: string; en: string }[];
}

export const NEWS_CATEGORIES: Record<NewsCategory, { zh: string; en: string }> = {
  industry:     { zh: "行业动态", en: "Industry" },
  release:      { zh: "新品发布", en: "New Release" },
  event:        { zh: "活动促销", en: "Event & Deals" },
  transparency: { zh: "透明度更新", en: "Transparency" },
  media:        { zh: "媒体报道", en: "Media" },
};

export const mockNews: NewsItem[] = [
  {
    id: "n-001", slug: "china-kids-mobility-2026-q1",
    category: "industry",
    title: { zh: "2026 Q1 中国童车市场规模突破 150 亿", en: "China Kids Mobility Market Exceeds ¥15B in Q1 2026" },
    summary: { zh: "受益于亲子户外消费升级，平衡车与儿童自行车品类双双迎来高增速。", en: "Driven by family outdoor upgrades, balance bikes and kids bikes both recorded strong growth." },
    source: { zh: "中国玩具及婴童用品协会", en: "China Toy & Baby Products Association" },
    date: "2026-04-28",
    tags: [{ zh: "市场数据", en: "Market Data" }, { zh: "增长趋势", en: "Growth Trend" }],
  },
  {
    id: "n-002", slug: "xyz-3000-launch",
    category: "release",
    title: { zh: "XYZ-3000 旗舰平衡车正式发布，搭载磁性刹车系统", en: "XYZ-3000 Flagship Balance Bike Launches with Magnetic Braking" },
    summary: { zh: "XYZ 品牌年度旗舰款上市，磁性刹车系统为行业首次应用，安全性能大幅提升。", en: "XYZ's annual flagship arrives with first-in-industry magnetic braking, significantly improving safety performance." },
    source: { zh: "KidsCarLab 编辑部", en: "KidsCarLab Editorial" },
    date: "2026-04-20",
    tags: [{ zh: "新品", en: "New Product" }, { zh: "安全创新", en: "Safety Innovation" }],
  },
  {
    id: "n-003", slug: "kids-outdoor-festival-2026",
    category: "event",
    title: { zh: "2026 亲子户外节：童车专区早鸟折扣最高 30%", en: "2026 Family Outdoor Festival: Kids Bike Zone Up to 30% Off Early Bird" },
    summary: { zh: "本届亲子户外节设立专属童车体验区，多个主流品牌提供现场试乘与限时优惠。", en: "This year's festival features a dedicated kids bike experience zone with test rides and limited-time brand offers." },
    source: { zh: "活动主办方", en: "Event Organizer" },
    date: "2026-04-15",
    tags: [{ zh: "活动", en: "Event" }, { zh: "优惠", en: "Deals" }],
  },
  {
    id: "n-004", slug: "methodology-v21-update",
    category: "transparency",
    title: { zh: "测试方法 v2.1 更新：耐久性测试时长提升至 500 小时", en: "Methodology v2.1 Update: Durability Test Duration Raised to 500h" },
    summary: { zh: "KidsCarLab 更新测试方法，耐久性模拟测试时长从 300 小时提升至 500 小时，同时新增材料无毒认证子项。", en: "KidsCarLab updated its methodology — durability simulation raised from 300h to 500h; non-toxic certification added as sub-metric." },
    source: { zh: "KidsCarLab 测试团队", en: "KidsCarLab Test Team" },
    date: "2026-04-15",
    tags: [{ zh: "方法更新", en: "Methodology Update" }, { zh: "透明度", en: "Transparency" }],
  },
  {
    id: "n-005", slug: "cctv-kids-safety-report",
    category: "media",
    title: { zh: "央视财经关注童车安全问题，多品牌质检情况披露", en: "CCTV Finance Reports on Kids Bike Safety, Multi-Brand QC Disclosure" },
    summary: { zh: "央视财经对市售主流童车进行专题调查，本次报道涉及结构稳定性与材料安全两大核心维度。", en: "CCTV Finance conducted a special investigation into mainstream kids bikes, covering structural stability and material safety." },
    source: { zh: "央视财经", en: "CCTV Finance" },
    date: "2026-04-10",
    tags: [{ zh: "媒体", en: "Media" }, { zh: "质量安全", en: "Quality Safety" }],
  },
  {
    id: "n-006", slug: "safewheel-recall-notice",
    category: "transparency",
    title: { zh: "SafeWheel Pro 批次召回通知：部分紧固件存在松动风险", en: "SafeWheel Pro Batch Recall: Fastener Loosening Risk in Specific Lots" },
    summary: { zh: "SafeWheel 品牌主动发布召回通知，涉及 2025 年 Q4 生产批次，建议用户核查序列号并联系售后。", en: "SafeWheel proactively issued a recall for Q4 2025 production batches; users advised to check serial numbers and contact after-sales." },
    source: { zh: "SafeWheel 官方", en: "SafeWheel Official" },
    date: "2026-04-05",
    tags: [{ zh: "召回", en: "Recall" }, { zh: "安全通告", en: "Safety Notice" }],
  },
];

export const ALL_NEWS_CATEGORIES: NewsCategory[] = ["industry", "release", "event", "transparency", "media"];
