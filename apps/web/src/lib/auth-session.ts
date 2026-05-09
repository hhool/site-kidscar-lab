import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "kcl_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  exp: number;
};

type SessionInspection = {
  ok: boolean;
  reason?: "MISSING" | "MALFORMED" | "INVALID_SIGNATURE" | "EXPIRED";
  payload?: SessionPayload;
};

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSessionSecret(): string {
  return process.env.AUTH_SESSION_SECRET || "dev-insecure-session-secret-change-me";
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function inspectSessionToken(token: string | undefined): SessionInspection {
  if (!token) {
    return { ok: false, reason: "MISSING" };
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return { ok: false, reason: "MALFORMED" };
  }

  const expected = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return { ok: false, reason: "INVALID_SIGNATURE" };
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return { ok: false, reason: "INVALID_SIGNATURE" };
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (!payload.userId || typeof payload.exp !== "number") {
      return { ok: false, reason: "MALFORMED" };
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { ok: false, reason: "EXPIRED" };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "MALFORMED" };
  }
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  const inspected = inspectSessionToken(token);
  return inspected.ok ? inspected.payload || null : null;
}

export function getSessionMaxAge(): number {
  return SESSION_TTL_SECONDS;
}
