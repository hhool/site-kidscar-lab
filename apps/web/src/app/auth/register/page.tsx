import { PageShell } from "@/components/PageShell";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <PageShell
      title={{ zh: "用户注册", en: "Register" }}
      description={{
        zh: "创建 KidsCarLab 账号。当前为 MVP 表单验证版本。",
        en: "Create your KidsCarLab account. This is an MVP validation-only version.",
      }}
    >
      <div className="mx-auto mt-6 w-full max-w-md">
        <RegisterForm />
      </div>
    </PageShell>
  );
}
