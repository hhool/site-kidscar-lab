type PageShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        <p className="mt-3 max-w-3xl text-zinc-600">{description}</p>
      </section>
      {children}
    </main>
  );
}
