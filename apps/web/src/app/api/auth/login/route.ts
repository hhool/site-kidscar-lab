import { NextResponse } from "next/server";
import { loginUser } from "@/lib/mock-auth";
import { AUTH_COOKIE_NAME, createSessionToken, getSessionMaxAge } from "@/lib/auth-session";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginPayload = {
  email: string;
  password: string;
};

function isLoginPayload(payload: unknown): payload is LoginPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<LoginPayload>;
  return typeof candidate.email === "string" && typeof candidate.password === "string";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errorCode: "INVALID_PAYLOAD", message: "Invalid request payload." }, { status: 400 });
  }

  if (!isLoginPayload(body)) {
    return NextResponse.json({ ok: false, errorCode: "INVALID_PAYLOAD", message: "Invalid request payload." }, { status: 400 });
  }

  const email = body.email.trim();
  const password = body.password;

  if (!EMAIL_REGEX.test(email) || password.length < 8) {
    return NextResponse.json({ ok: false, errorCode: "VALIDATION_ERROR", message: "Invalid email or password format." }, { status: 400 });
  }

  try {
    const result = await loginUser({ email, password });
    if (!result.ok) {
      return NextResponse.json({ ok: false, errorCode: result.errorCode, message: "Invalid email or password." }, { status: 401 });
    }

    const token = createSessionToken(result.user.id);

    const response = NextResponse.json({
      ok: true,
      message: "Login successful.",
      user: result.user,
      token,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getSessionMaxAge(),
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR", message: "Server error while logging in." }, { status: 500 });
  }
}
