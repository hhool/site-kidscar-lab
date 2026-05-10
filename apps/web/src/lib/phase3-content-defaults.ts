import snapshotJson from "../../data/site-content-snapshot.json";
import { type BrandProfile } from "@/lib/brands-data";
import { type FeedbackItem, type Poll, type QAPost } from "@/lib/community-data";
import { type DealItem } from "@/lib/deals-data";
import { type GuideItem } from "@/lib/guides-data";
import { type NewsItem } from "@/lib/news-data";
import { type ProductItem } from "@/lib/products-data";
import { type RankingItem } from "@/lib/rankings-data";
import { type Review } from "@/lib/reviews-data";

export type Phase3ContentSnapshot = {
  products: ProductItem[];
  reviews: Review[];
  rankings: RankingItem[];
  news: NewsItem[];
  guides: GuideItem[];
  brands: BrandProfile[];
  deals: DealItem[];
  community: {
    qaPosts: QAPost[];
    polls: Poll[];
    feedback: FeedbackItem[];
  };
};

export const defaultPhase3ContentSnapshot = snapshotJson as Phase3ContentSnapshot;
