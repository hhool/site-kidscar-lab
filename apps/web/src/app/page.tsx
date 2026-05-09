import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { ROUTES } from "@/lib/constants/routes";

const moduleLinks = [
  { href: ROUTES.reviews, title: "评测 Reviews", desc: "最新评测、分类评测、更新记录" },
  { href: ROUTES.rankings, title: "排名 Rankings", desc: "综合分、特性、用户评分、安全与性价比" },
  { href: ROUTES.products, title: "产品 Products", desc: "结构化参数、筛选和对比入口" },
  { href: ROUTES.news, title: "资讯 News", desc: "行业动态、发布和透明度更新" },
  { href: ROUTES.about, title: "关于 About", desc: "测试方法、数据来源与团队透明度" },
  { href: ROUTES.compare, title: "对比 Compare", desc: "2-4 产品并排对比" },
  { href: ROUTES.methodology, title: "测试方法 Methodology", desc: "指标定义与评分规则" },
  { href: ROUTES.testResults, title: "测试结果 Test Results", desc: "指标数据库与筛选" },
  { href: ROUTES.guides, title: "指南 Guides", desc: "购买和使用指导" },
  { href: ROUTES.brands, title: "品牌 Brands", desc: "品牌档案与型号聚合" },
  { href: ROUTES.deals, title: "优惠 Deals", desc: "价格占位和优惠聚合" },
  { href: ROUTES.community, title: "社区 Community", desc: "反馈、问答与投票占位" },
];

export default function Home() {
  return (
    <PageShell
      title="童车评测站点工程化骨架"
      description="已从静态原型迁移到 Next.js。当前页面用于承接 Phase 0 Day 2 的统一布局与路由骨架。"
    >
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moduleLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-400"
          >
            <h2 className="font-medium text-zinc-900">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{item.desc}</p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
