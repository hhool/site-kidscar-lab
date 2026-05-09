/**
 * Deals / Prices Data
 */

export type DealChannel = "official" | "jd" | "tmall" | "amazon" | "offline";
export type DealStatus = "active" | "expired" | "coming";

export interface PricePoint {
  date: string;
  price: number;
}

export interface DealItem {
  id: string;
  productName: { zh: string; en: string };
  brand: string;
  channel: DealChannel;
  status: DealStatus;
  originalPrice: number;
  dealPrice: number;
  discount: number; // percentage off, e.g. 20 = 20% off
  validUntil?: string;
  description: { zh: string; en: string };
  priceHistory: PricePoint[];
}

export const CHANNEL_LABELS: Record<DealChannel, { zh: string; en: string }> = {
  official: { zh: "品牌官网", en: "Official Store" },
  jd:       { zh: "京东", en: "JD.com" },
  tmall:    { zh: "天猫", en: "Tmall" },
  amazon:   { zh: "亚马逊", en: "Amazon" },
  offline:  { zh: "线下门店", en: "Offline Store" },
};

export const STATUS_LABELS: Record<DealStatus, { zh: string; en: string }> = {
  active:  { zh: "进行中", en: "Active" },
  expired: { zh: "已结束", en: "Expired" },
  coming:  { zh: "即将开始", en: "Coming Soon" },
};

export const mockDeals: DealItem[] = [
  {
    id: "d-001",
    productName: { zh: "XYZ-2000 超级平衡车", en: "XYZ-2000 Super Balance Bike" },
    brand: "XYZ",
    channel: "tmall",
    status: "active",
    originalPrice: 199,
    dealPrice: 149,
    discount: 25,
    validUntil: "2026-05-20",
    description: { zh: "五一大促限时优惠，购买附赠头盔套装。", en: "May Day promo — limited time, free helmet set included." },
    priceHistory: [
      { date: "2026-01", price: 199 },
      { date: "2026-02", price: 199 },
      { date: "2026-03", price: 179 },
      { date: "2026-04", price: 169 },
      { date: "2026-05", price: 149 },
    ],
  },
  {
    id: "d-002",
    productName: { zh: "TotRide Mini 三轮车", en: "TotRide Mini Tricycle" },
    brand: "TotRide",
    channel: "jd",
    status: "active",
    originalPrice: 159,
    dealPrice: 129,
    discount: 19,
    validUntil: "2026-05-15",
    description: { zh: "京东自营限时折扣，支持 30 天无理由退换。", en: "JD self-operated limited discount, 30-day no-reason return." },
    priceHistory: [
      { date: "2026-01", price: 159 },
      { date: "2026-02", price: 159 },
      { date: "2026-03", price: 149 },
      { date: "2026-04", price: 139 },
      { date: "2026-05", price: 129 },
    ],
  },
  {
    id: "d-003",
    productName: { zh: "MiniGo 轻量滑板车", en: "MiniGo Lightweight Scooter" },
    brand: "MiniGo",
    channel: "official",
    status: "coming",
    originalPrice: 99,
    dealPrice: 69,
    discount: 30,
    validUntil: "2026-06-01",
    description: { zh: "六一儿童节专场预售，前 500 名享最低价。", en: "Children's Day pre-sale — first 500 orders get the lowest price." },
    priceHistory: [
      { date: "2026-01", price: 99 },
      { date: "2026-02", price: 89 },
      { date: "2026-03", price: 89 },
      { date: "2026-04", price: 79 },
      { date: "2026-05", price: 79 },
    ],
  },
  {
    id: "d-004",
    productName: { zh: "SafeWheel Pro 儿童自行车", en: "SafeWheel Pro Kids Bike" },
    brand: "SafeWheel",
    channel: "amazon",
    status: "expired",
    originalPrice: 259,
    dealPrice: 199,
    discount: 23,
    description: { zh: "亚马逊春季大促已结束，当前价格请以官网为准。", en: "Amazon spring promo has ended. Check official store for current price." },
    priceHistory: [
      { date: "2026-01", price: 259 },
      { date: "2026-02", price: 239 },
      { date: "2026-03", price: 199 },
      { date: "2026-04", price: 219 },
      { date: "2026-05", price: 219 },
    ],
  },
];

export const ALL_CHANNELS: DealChannel[] = ["official", "jd", "tmall", "amazon", "offline"];
export const ALL_DEAL_STATUSES: DealStatus[] = ["active", "coming", "expired"];
