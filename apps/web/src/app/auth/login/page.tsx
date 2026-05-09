import { PageShell } from "@/components/PageShell";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <PageShell
      title={{ zh: "用户登录", en: "Login" }}
      description={{
        zh: "使用邮箱和密码登录。当前为 MVP 表单验证版本。",
        en: "Login with email and password. This is an MVP validation-only version.",
      }}
    >
      <div className="mx-auto mt-6 w-full max-w-md">
        <LoginForm />
      </div>
    </PageShell>
  );
}
