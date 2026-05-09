import { PageShell } from "@/components/PageShell";
import { LoginForm } from "@/components/LoginForm";

type LoginPageProps = {
  searchParams?: Promise<{ reason?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const reason = params?.reason;

  return (
    <PageShell
      title={{ zh: "用户登录", en: "Login" }}
      description={{
        zh: "使用邮箱和密码登录。当前为 MVP 表单验证版本。",
        en: "Login with email and password. This is an MVP validation-only version.",
      }}
    >
      <div className="mx-auto mt-6 w-full max-w-md">
        <LoginForm redirectReason={reason} />
      </div>
    </PageShell>
  );
}
