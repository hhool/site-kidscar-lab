import { NextResponse } from "next/server";
import { registerUser } from "@/lib/mock-auth";
import { AUTH_COOKIE_NAME, createSessionToken, getSessionMaxAge } from "@/lib/auth-session";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

function isRegisterPayload(payload: unknown): payload is RegisterPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<RegisterPayload>;
  return typeof candidate.name === "string" && typeof candidate.email === "string" && typeof candidate.password === "string";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errorCode: "INVALID_PAYLOAD", message: "Invalid request payload." }, { status: 400 });
  }

  if (!isRegisterPayload(body)) {
    return NextResponse.json({ ok: false, errorCode: "INVALID_PAYLOAD", message: "Invalid request payload." }, { status: 400 });
  }

  const name = body.name.trim();
  const email = body.email.trim();
  const password = body.password;

  if (name.length < 2) {
    return NextResponse.json({ ok: false, errorCode: "VALIDATION_ERROR", message: "Name must be at least 2 characters." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ ok: false, errorCode: "VALIDATION_ERROR", message: "Invalid email format." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ ok: false, errorCode: "VALIDATION_ERROR", message: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const result = await registerUser({ name, email, password });
    if (!result.ok) {
      return NextResponse.json({ ok: false, errorCode: result.errorCode, message: "Email is already registered." }, { status: 409 });
    }

    const token = createSessionToken(result.user.id);

    const response = NextResponse.json(
      {
        ok: true,
        message: "Registration successful.",
        user: result.user,
        token,
      },
      { status: 201 },
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getSessionMaxAge(),
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR", message: "Server error while registering." }, { status: 500 });
  }
}
