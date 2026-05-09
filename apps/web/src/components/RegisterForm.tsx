"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ROUTES } from "@/lib/constants/routes";
import { useAppLang } from "./useAppLang";

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const { isZh } = useAppLang();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const labels = useMemo(
    () =>
      isZh
        ? {
            title: "创建账号",
            name: "昵称",
            email: "邮箱",
            password: "密码",
            confirmPassword: "确认密码",
            submit: "注册",
            helper: "已有账号？去登录",
            success: "表单验证通过，可在下一阶段接入真实注册 API。",
          }
        : {
            title: "Create account",
            name: "Display Name",
            email: "Email",
            password: "Password",
            confirmPassword: "Confirm Password",
            submit: "Register",
            helper: "Already have an account? Login",
            success: "Validation passed. A real signup API can be integrated in the next phase.",
          },
    [isZh],
  );

  const validate = () => {
    const nextErrors: RegisterErrors = {};

    if (!name.trim()) {
      nextErrors.name = isZh ? "请输入昵称" : "Display name is required";
    } else if (name.trim().length < 2) {
      nextErrors.name = isZh ? "昵称至少 2 个字符" : "Display name must be at least 2 characters";
    }

    if (!email.trim()) {
      nextErrors.email = isZh ? "请输入邮箱" : "Email is required";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = isZh ? "邮箱格式不正确" : "Invalid email format";
    }

    if (!password) {
      nextErrors.password = isZh ? "请输入密码" : "Password is required";
    } else if (password.length < 8) {
      nextErrors.password = isZh ? "密码至少 8 位" : "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = isZh ? "请确认密码" : "Please confirm your password";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = isZh ? "两次密码不一致" : "Passwords do not match";
    }

    return nextErrors;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      nextErrors.form = isZh ? "请先修正表单错误" : "Please fix the form errors first";
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900">{labels.title}</h2>

      {errors.form && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>}
      {submitted && <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{labels.success}</p>}

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-zinc-800">{labels.name}</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          placeholder={isZh ? "例如：小骑手爸爸" : "For example: Alex"}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-zinc-800">{labels.email}</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          placeholder="name@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-zinc-800">{labels.password}</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          placeholder={isZh ? "至少 8 位" : "At least 8 characters"}
        />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
      </div>

      <div className="mb-5">
        <label className="mb-1 block text-sm font-medium text-zinc-800">{labels.confirmPassword}</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          placeholder={isZh ? "再次输入密码" : "Enter password again"}
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
      </div>

      <button type="submit" className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
        {labels.submit}
      </button>

      <p className="mt-4 text-center text-sm text-zinc-600">
        <Link href={ROUTES.authLogin} className="font-medium text-blue-600 hover:text-blue-700">
          {labels.helper}
        </Link>
      </p>
    </form>
  );
}
