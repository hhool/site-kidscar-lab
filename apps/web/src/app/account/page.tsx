import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { ROUTES } from "@/lib/constants/routes";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth-session";
import { getUserById } from "@/lib/mock-auth";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect(ROUTES.authLogin);
  }

  const user = await getUserById(session.userId);
  if (!user) {
    redirect(ROUTES.authLogin);
  }

  return (
    <PageShell
      title={{ zh: "用户中心", en: "Account" }}
      description={{
        zh: "当前账号已登录，可在下一阶段扩展收藏、历史记录与偏好设置。",
        en: "You are signed in. Favorites, history, and preferences can be expanded in the next phase.",
      }}
    >
      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-zinc-900">{user.name}</h2>
        <p className="mt-2 text-sm text-zinc-600">{user.email}</p>
        <p className="mt-2 text-xs text-zinc-500">ID: {user.id}</p>
      </section>
    </PageShell>
  );
}
