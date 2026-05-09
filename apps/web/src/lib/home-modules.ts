/**
 * Home Page Module Configuration
 *
 * This structure supports flexible home page layouts and can be easily
 * migrated to a CMS (Payload, Contentful, etc.) later.
 *
 * Each module has:
 * - id: unique identifier
 * - type: component type to render
 * - title: localized display name
 * - config: module-specific configuration
 * - order: display order on page
 */

export interface HomePageModuleConfig {
  id: string;
  type: "hero" | "rankings" | "picks" | "news" | "transparency" | "modules-grid";
  title: { zh: string; en: string };
  description?: { zh: string; en: string };
  order: number;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export const HOME_PAGE_MODULES: HomePageModuleConfig[] = [
  {
    id: "hero-carousel",
    type: "hero",
    title: { zh: "英雄轮播", en: "Hero Carousel" },
    description: {
      zh: "首页顶部轮播，展示最新评测与特色内容",
      en: "Hero carousel showcasing latest reviews and featured content",
    },
    order: 1,
    enabled: true,
    config: {
      autoPlayInterval: 5000, // 5 seconds
      showNavigation: true,
      slidesToShow: 1,
    },
  },
  {
    id: "featured-rankings",
    type: "rankings",
    title: { zh: "特色榜单", en: "Featured Rankings" },
    description: {
      zh: "展示当前热门排名前三的产品",
      en: "Display top 3 featured products from current rankings",
    },
    order: 2,
    enabled: true,
    config: {
      itemCount: 3,
      showScore: true,
      showBadge: true,
    },
  },
  {
    id: "editor-picks",
    type: "picks",
    title: { zh: "编辑精选", en: "Editor's Picks" },
    description: {
      zh: "编辑推荐的高价值产品选择",
      en: "Editor-recommended high-value product selections",
    },
    order: 3,
    enabled: true,
    config: {
      itemCount: 3,
      layout: "grid",
      columns: 3, // responsive, adjusts on smaller screens
    },
  },
  {
    id: "news-highlights",
    type: "news",
    title: { zh: "最新资讯", en: "Latest News" },
    description: {
      zh: "行业动态与产品更新的快速入口",
      en: "Quick access to industry news and product updates",
    },
    order: 4,
    enabled: true,
    config: {
      itemCount: 3,
      showCategory: true,
      showDate: true,
    },
  },
  {
    id: "transparency-promo",
    type: "transparency",
    title: { zh: "透明度入口", en: "Transparency Entry" },
    description: {
      zh: "强调评测透明度与数据追溯能力",
      en: "Emphasize test transparency and data traceability",
    },
    order: 5,
    enabled: true,
    config: {
      itemCount: 4,
      layout: "grid",
      showIcon: true,
    },
  },
  {
    id: "modules-grid",
    type: "modules-grid",
    title: { zh: "模块导航网格", en: "Module Navigation Grid" },
    description: {
      zh: "显示所有一级模块的导航网格，便于用户快速访问",
      en: "Navigation grid showing all primary modules for quick access",
    },
    order: 6,
    enabled: true,
    config: {
      columns: 3,
      showDescription: true,
    },
  },
];

/**
 * Get enabled modules in order
 */
export function getEnabledModules(): HomePageModuleConfig[] {
  return HOME_PAGE_MODULES.filter((m) => m.enabled).sort((a, b) => a.order - b.order);
}

/**
 * Get module by ID
 */
export function getModuleById(id: string): HomePageModuleConfig | undefined {
  return HOME_PAGE_MODULES.find((m) => m.id === id);
}

/**
 * CMS Integration Hints
 *
 * When migrating to a CMS, consider:
 * 1. Store module order & enabled status in CMS
 * 2. Allow CMS to override title, description, and config
 * 3. Support dynamic module types (new component types added over time)
 * 4. Cache module configuration at build time or revalidation interval
 * 5. Support A/B testing by storing multiple versions
 */
