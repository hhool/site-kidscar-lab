import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth-session";
import { getUserById } from "@/lib/mock-auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    const payload = verifySessionToken(token);

    if (!payload) {
      return NextResponse.json({ ok: true, authed: false, user: null });
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ ok: true, authed: false, user: null });
    }

    return NextResponse.json({ ok: true, authed: true, user });
  } catch {
    return NextResponse.json({ ok: false, authed: false, user: null, errorCode: "SERVER_ERROR" }, { status: 500 });
  }
}
