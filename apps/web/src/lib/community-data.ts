/**
 * Community Data — Q&A, feedback threads, and polls
 */

export type PostStatus = "open" | "answered" | "closed";
export type VoteOption = { id: string; label: { zh: string; en: string }; votes: number };

export interface QAPost {
  id: string;
  status: PostStatus;
  question: { zh: string; en: string };
  askedBy: string;
  askedDate: string;
  tags: { zh: string; en: string }[];
  answerCount: number;
  topAnswer?: { zh: string; en: string };
}

export interface Poll {
  id: string;
  question: { zh: string; en: string };
  closingDate?: string;
  totalVotes: number;
  options: VoteOption[];
}

export interface FeedbackItem {
  id: string;
  author: string;
  date: string;
  rating: number; // 1-5
  content: { zh: string; en: string };
  productName: { zh: string; en: string };
  verified: boolean;
}

export const mockQAPosts: QAPost[] = [
  {
    id: "qa-001",
    status: "answered",
    question: { zh: "3 岁孩子第一辆车选平衡车还是三轮车？", en: "First bike for a 3-year-old: balance bike or tricycle?" },
    askedBy: "lily_mom",
    askedDate: "2026-04-20",
    tags: [{ zh: "选购", en: "Buying" }, { zh: "3 岁", en: "Age 3" }],
    answerCount: 8,
    topAnswer: {
      zh: "如果孩子已满 3 岁且体力协调发展正常，强烈推荐平衡车——锻炼平衡感更直接，也更容易过渡到两轮自行车。",
      en: "If your child is 3+ with normal motor development, a balance bike is strongly recommended — it builds balance more directly and eases the transition to a two-wheeler.",
    },
  },
  {
    id: "qa-002",
    status: "open",
    question: { zh: "SafeWheel Pro 召回批次如何核查序列号？", en: "How do I check if my SafeWheel Pro is in the recalled batch?" },
    askedBy: "kevin_dad",
    askedDate: "2026-04-18",
    tags: [{ zh: "召回", en: "Recall" }, { zh: "SafeWheel", en: "SafeWheel" }],
    answerCount: 3,
  },
  {
    id: "qa-003",
    status: "answered",
    question: { zh: "平衡车充气轮胎多久充一次气合适？", en: "How often should I inflate pneumatic tires on a balance bike?" },
    askedBy: "sun_family",
    askedDate: "2026-04-10",
    tags: [{ zh: "保养", en: "Maintenance" }, { zh: "轮胎", en: "Tires" }],
    answerCount: 5,
    topAnswer: {
      zh: "建议每月检查一次，充气至建议胎压区间（通常标注在轮胎侧壁）。日常使用后如发现轮胎有明显变软，应立即检查。",
      en: "Check monthly and inflate to the recommended pressure range (usually marked on the tire sidewall). If the tire feels noticeably soft after regular use, inspect immediately.",
    },
  },
  {
    id: "qa-004",
    status: "open",
    question: { zh: "XYZ-2000 和 XYZ-3000 值得差价吗？", en: "Is the XYZ-3000 worth the price difference over the XYZ-2000?" },
    askedBy: "zhang_parent",
    askedDate: "2026-04-28",
    tags: [{ zh: "对比", en: "Comparison" }, { zh: "XYZ", en: "XYZ" }],
    answerCount: 2,
  },
];

export const mockPolls: Poll[] = [
  {
    id: "poll-001",
    question: { zh: "你最看重童车的哪个维度？", en: "Which aspect of a kids bike matters most to you?" },
    totalVotes: 342,
    options: [
      { id: "safety", label: { zh: "安全性", en: "Safety" }, votes: 187 },
      { id: "value", label: { zh: "性价比", en: "Value for Money" }, votes: 83 },
      { id: "durability", label: { zh: "耐久性", en: "Durability" }, votes: 47 },
      { id: "design", label: { zh: "外观设计", en: "Design & Aesthetics" }, votes: 25 },
    ],
  },
  {
    id: "poll-002",
    question: { zh: "你倾向于从哪个渠道购买童车？", en: "Where do you prefer to buy kids bikes?" },
    totalVotes: 218,
    closingDate: "2026-05-31",
    options: [
      { id: "tmall", label: { zh: "天猫/淘宝", en: "Tmall / Taobao" }, votes: 89 },
      { id: "jd", label: { zh: "京东", en: "JD.com" }, votes: 74 },
      { id: "offline", label: { zh: "线下实体店", en: "Offline Store" }, votes: 41 },
      { id: "official", label: { zh: "品牌官网", en: "Brand Official Site" }, votes: 14 },
    ],
  },
];

export const mockFeedback: FeedbackItem[] = [
  {
    id: "fb-001",
    author: "Emma_parent",
    date: "2026-04-25",
    rating: 5,
    content: {
      zh: "XYZ-2000 的安全评分完全名副其实，孩子骑了两个月依然稳定，刹车灵敏，非常满意。",
      en: "The XYZ-2000's safety score is fully deserved. After two months of use it's still solid, brakes are responsive. Very satisfied.",
    },
    productName: { zh: "XYZ-2000 超级平衡车", en: "XYZ-2000 Super Balance Bike" },
    verified: true,
  },
  {
    id: "fb-002",
    author: "tom_dad",
    date: "2026-04-18",
    rating: 4,
    content: {
      zh: "TotRide Mini 整体不错，组装简单，孩子很喜欢。唯一建议是推杆的握持长度对身高较高的家长有点短。",
      en: "TotRide Mini is solid overall, easy to assemble, and the kid loves it. Only suggestion: the push handle is a bit short for taller parents.",
    },
    productName: { zh: "TotRide Mini 三轮车", en: "TotRide Mini Tricycle" },
    verified: true,
  },
  {
    id: "fb-003",
    author: "sarah_m",
    date: "2026-04-10",
    rating: 5,
    content: {
      zh: "本站的测试数据帮助我排除了三个选项，最终选到真正适合的平衡车。希望未来能有更多本土品牌的测试覆盖。",
      en: "The test data on this site helped me eliminate three options and find the right balance bike. Hope to see more domestic brand coverage in the future.",
    },
    productName: { zh: "KidsCarLab 网站", en: "KidsCarLab Website" },
    verified: false,
  },
];
