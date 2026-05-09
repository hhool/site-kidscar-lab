/**
 * Guides / Articles Data
 */

export type GuideCategory = "buying" | "safety" | "maintenance" | "age-guide" | "comparison";

export interface GuideItem {
  id: string;
  slug: string;
  category: GuideCategory;
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
  readingTime: number; // minutes
  publishedDate: string;
  updatedDate?: string;
  tags: { zh: string; en: string }[];
  toc: { anchor: string; label: { zh: string; en: string } }[];
  body: { zh: string; en: string }; // simplified prose for MVP
}

export const GUIDE_CATEGORIES: Record<GuideCategory, { zh: string; en: string }> = {
  buying:      { zh: "选购指南", en: "Buying Guide" },
  safety:      { zh: "安全须知", en: "Safety" },
  maintenance: { zh: "保养维护", en: "Maintenance" },
  "age-guide": { zh: "年龄对照", en: "Age Guide" },
  comparison:  { zh: "横向对比", en: "Comparison" },
};

export const mockGuides: GuideItem[] = [
  {
    id: "g-001",
    slug: "how-to-choose-balance-bike",
    category: "buying",
    title: { zh: "平衡车怎么选？3 个关键指标帮你避坑", en: "How to Choose a Balance Bike: 3 Key Metrics to Avoid Mistakes" },
    summary: { zh: "平衡车市场良莠不齐，本文从车架高度、轮胎类型和制动设计三个维度，帮你系统筛选。", en: "The balance bike market varies wildly. This guide breaks down frame height, tire type, and brake design to help you filter systematically." },
    readingTime: 7,
    publishedDate: "2026-03-10",
    updatedDate: "2026-04-20",
    tags: [{ zh: "平衡车", en: "Balance Bike" }, { zh: "选购", en: "Buying" }],
    toc: [
      { anchor: "frame-height", label: { zh: "车架高度", en: "Frame Height" } },
      { anchor: "tire-type", label: { zh: "轮胎类型", en: "Tire Type" } },
      { anchor: "brakes", label: { zh: "制动设计", en: "Brake Design" } },
      { anchor: "checklist", label: { zh: "选购清单", en: "Buying Checklist" } },
    ],
    body: {
      zh: "选购平衡车时，首先确认座椅最低高度比孩子腿长（内腿长）短 1-2cm，确保双脚可平稳着地。其次，充气轮胎提供更好的减震与抓地力，适合室外路面；EVA 发泡轮胎免维护，适合室内或平整地面。最后，手刹设计对 4 岁以上的孩子来说是重要的安全缓冲，建议优先选择配备手刹的型号。",
      en: "When choosing a balance bike, first confirm the minimum seat height is 1-2cm shorter than your child's inseam, ensuring both feet rest flat on the ground. Next, pneumatic tires offer better cushioning and grip for outdoor terrain; EVA foam tires are maintenance-free and ideal for indoor or smooth surfaces. Finally, hand brakes are an important safety buffer for children 4 and older — prioritize models with hand brakes.",
    },
  },
  {
    id: "g-002",
    slug: "kids-bike-age-guide",
    category: "age-guide",
    title: { zh: "0-12 岁童车年龄对照表：何时换、换什么", en: "0-12 Age Guide: When to Switch Kids Bikes and What to Choose" },
    summary: { zh: "从婴儿三轮车到儿童自行车，梳理各年龄段最适合的车型与关键参数范围。", en: "From infant tricycles to full kids bikes, a structured breakdown of optimal vehicle types and key parameter ranges by age." },
    readingTime: 10,
    publishedDate: "2026-02-15",
    tags: [{ zh: "年龄对照", en: "Age Guide" }, { zh: "选购", en: "Buying" }],
    toc: [
      { anchor: "1-3", label: { zh: "1-3 岁：三轮车阶段", en: "1-3: Tricycle Stage" } },
      { anchor: "3-5", label: { zh: "3-5 岁：平衡车阶段", en: "3-5: Balance Bike Stage" } },
      { anchor: "5-8", label: { zh: "5-8 岁：入门自行车", en: "5-8: Starter Bike" } },
      { anchor: "8-12", label: { zh: "8-12 岁：成长自行车", en: "8-12: Growth Bike" } },
    ],
    body: {
      zh: "1-3 岁推荐带推杆的亲子三轮车，家长可辅助推行，孩子逐步建立平衡感知。3-5 岁是平衡车黄金期，无踏板设计能让孩子自然发展平衡与协调能力。5-8 岁可引入 12-16 寸儿童自行车，配合辅助轮过渡后撤除。8-12 岁选择可调节车架的成长型自行车，兼顾骑行效率与长期使用周期。",
      en: "Ages 1-3: parent-push tricycles with push handle help kids develop balance awareness. Ages 3-5: the golden balance bike window — pedal-free design naturally builds balance and coordination. Ages 5-8: introduce 12-16\" kids bikes with training wheels, then remove them. Ages 8-12: adjustable-frame growth bikes balance riding efficiency with a longer usage lifecycle.",
    },
  },
  {
    id: "g-003",
    slug: "kids-bike-safety-checklist",
    category: "safety",
    title: { zh: "童车安全检查清单：每次骑行前必做的 6 步", en: "Kids Bike Safety Checklist: 6 Steps Before Every Ride" },
    summary: { zh: "参考儿童产品安全标准，整理家长可独立完成的骑行前安全检查步骤。", en: "Based on child product safety standards, a self-service pre-ride safety checklist for parents." },
    readingTime: 5,
    publishedDate: "2026-01-20",
    tags: [{ zh: "安全", en: "Safety" }, { zh: "检查清单", en: "Checklist" }],
    toc: [
      { anchor: "helmet", label: { zh: "头盔适配", en: "Helmet Fit" } },
      { anchor: "tire", label: { zh: "轮胎气压", en: "Tire Pressure" } },
      { anchor: "brake", label: { zh: "制动测试", en: "Brake Test" } },
      { anchor: "fasteners", label: { zh: "紧固件检查", en: "Fastener Check" } },
      { anchor: "seat", label: { zh: "座高调节", en: "Seat Height" } },
      { anchor: "environment", label: { zh: "骑行环境评估", en: "Environment Assessment" } },
    ],
    body: {
      zh: "每次骑行前建议完成：①头盔松紧度检查（两指原则）；②轮胎气压是否在推荐范围内；③刹车线是否顺畅、刹车片磨损状态；④车把、座管、踏板紧固件是否松动；⑤座高是否符合当前身高；⑥骑行路面是否适合当前年龄段与车型。",
      en: "Before each ride: ① Check helmet tightness (two-finger rule). ② Check tire pressure is within recommended range. ③ Test brake cables for smooth operation and check pad wear. ④ Check handlebar, seat post, and pedal fasteners for looseness. ⑤ Verify seat height matches current stature. ⑥ Assess whether the surface is suitable for the child's age group and vehicle type.",
    },
  },
  {
    id: "g-004",
    slug: "balance-bike-vs-tricycle",
    category: "comparison",
    title: { zh: "平衡车 vs 三轮车：哪个更适合你的孩子？", en: "Balance Bike vs Tricycle: Which Is Right for Your Child?" },
    summary: { zh: "两种入门车型各有优劣，本文从年龄适配、运动发展和使用场景三个角度给出参考建议。", en: "Both starter types have pros and cons. This guide compares them across age fit, motor development, and usage context." },
    readingTime: 6,
    publishedDate: "2026-03-25",
    tags: [{ zh: "横向对比", en: "Comparison" }, { zh: "平衡车", en: "Balance Bike" }, { zh: "三轮车", en: "Tricycle" }],
    toc: [
      { anchor: "pros-cons", label: { zh: "优劣对比", en: "Pros & Cons" } },
      { anchor: "age-fit", label: { zh: "年龄适配", en: "Age Fit" } },
      { anchor: "recommendation", label: { zh: "推荐建议", en: "Recommendation" } },
    ],
    body: {
      zh: "三轮车结构稳定，适合 1-3 岁初次接触骑行的孩子，但对平衡能力的锻炼有限。平衡车通过双脚蹬地前进，能让孩子更快建立身体平衡感，是 3-5 岁的首选。如果孩子尚未满 3 岁，或户外骑行场地较为平整，推荐先从带推杆三轮车起步；若孩子已满 3 岁且有一定体力协调基础，直接选择平衡车将更有利于其未来过渡到两轮自行车。",
      en: "Tricycles offer structural stability for children 1-3 first encountering cycling, but provide limited balance training. Balance bikes — propelled by pushing with feet — help children develop body balance faster, making them the top choice for ages 3-5. If your child is under 3 or rides on very flat indoor surfaces, start with a push-handle tricycle. If they're 3+ with basic coordination, jumping straight to a balance bike will better prepare them for the transition to a two-wheel bike.",
    },
  },
];

export const ALL_GUIDE_CATEGORIES: GuideCategory[] = ["buying", "safety", "maintenance", "age-guide", "comparison"];
