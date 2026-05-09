"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ROUTES } from "@/lib/constants/routes";
import { useAppLang } from "./useAppLang";
import { emitAuthChange } from "@/lib/auth-sync";

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ApiErrorCode = "INVALID_PAYLOAD" | "VALIDATION_ERROR" | "INVALID_CREDENTIALS" | "EMAIL_EXISTS";

type AuthApiResponse = {
  ok: boolean;
  message?: string;
  errorCode?: ApiErrorCode;
};

function parseApiErrorMessage(errorCode: ApiErrorCode | undefined, isZh: boolean): string {
  if (errorCode === "INVALID_CREDENTIALS") {
    return isZh ? "邮箱或密码错误" : "Invalid email or password";
  }

  if (errorCode === "VALIDATION_ERROR") {
    return isZh ? "请求参数不合法" : "Invalid request parameters";
  }

  if (errorCode === "INVALID_PAYLOAD") {
    return isZh ? "请求体格式错误" : "Invalid request payload";
  }

  return isZh ? "登录失败，请稍后重试" : "Login failed, please try again later";
}

export function LoginForm() {
  const { isZh } = useAppLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const labels = useMemo(
    () =>
      isZh
        ? {
            title: "欢迎回来",
            email: "邮箱",
            password: "密码",
            submit: "登录",
            submitting: "登录中...",
            helper: "还没有账号？去注册",
            success: "登录成功，认证 API 已连通（MVP 模拟会话）。",
          }
        : {
            title: "Welcome back",
            email: "Email",
            password: "Password",
            submit: "Login",
            submitting: "Logging in...",
            helper: "No account yet? Register",
            success: "Login succeeded. Auth API is connected (MVP mock session).",
          },
    [isZh],
  );

  const validate = () => {
    const nextErrors: LoginErrors = {};

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

    return nextErrors;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      nextErrors.form = isZh ? "请先修正表单错误" : "Please fix the form errors first";
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = (await response.json()) as AuthApiResponse;

      if (!response.ok || !data.ok) {
        setErrors({ form: parseApiErrorMessage(data.errorCode, isZh) });
        return;
      }

      setSubmitted(true);
      emitAuthChange();
    } catch {
      setErrors({ form: isZh ? "网络异常，请稍后重试" : "Network error, please try again" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900">{labels.title}</h2>

      {errors.form && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>}
      {submitted && <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{labels.success}</p>}

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-zinc-800">{labels.email}</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          placeholder={isZh ? "name@example.com" : "name@example.com"}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div className="mb-5">
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? labels.submitting : labels.submit}
      </button>

      <p className="mt-4 text-center text-sm text-zinc-600">
        <Link href={ROUTES.authRegister} className="font-medium text-blue-600 hover:text-blue-700">
          {labels.helper}
        </Link>
      </p>
    </form>
  );
}
