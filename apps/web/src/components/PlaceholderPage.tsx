import { PageShell } from "@/components/PageShell";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <PageShell title={title} description={description}>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium text-zinc-900">模块状态</h2>
          <p className="mt-2 text-sm text-zinc-600">当前为 Day 2 占位页面，后续接入真实组件与数据源。</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="font-medium text-zinc-900">下一步</h2>
          <p className="mt-2 text-sm text-zinc-600">接入统一布局、筛选参数与多语言文案配置。</p>
        </article>
      </section>
    </PageShell>
  );
}
