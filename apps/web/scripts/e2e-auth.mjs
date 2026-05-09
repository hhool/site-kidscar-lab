import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

const port = Number(process.env.E2E_PORT || 3107);
const baseUrl = `http://127.0.0.1:${port}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function appendCookies(existing, setCookieHeader) {
  const jar = new Map(existing);
  const headers = Array.isArray(setCookieHeader) ? setCookieHeader : setCookieHeader ? [setCookieHeader] : [];

  for (const header of headers) {
    const [cookiePart] = header.split(";");
    const [name, ...rest] = cookiePart.split("=");
    if (!name) {
      continue;
    }

    const value = rest.join("=");
    if (value === "") {
      jar.delete(name.trim());
    } else {
      jar.set(name.trim(), value);
    }
  }

  return jar;
}

function cookieHeader(jar) {
  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

async function request(path, options = {}, jar = new Map()) {
  const headers = new Headers(options.headers || {});
  const cookieValue = cookieHeader(jar);

  if (cookieValue) {
    headers.set("cookie", cookieValue);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    redirect: "manual",
  });

  const setCookie = response.headers.getSetCookie ? response.headers.getSetCookie() : response.headers.get("set-cookie");
  return {
    response,
    jar: appendCookies(jar, setCookie),
  };
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/robots.txt`, { redirect: "manual" });
      if (response.ok || response.status === 404) {
        return;
      }
    } catch {
      // Keep polling until the server comes up.
    }

    await sleep(1000);
  }

  throw new Error(`Timed out waiting for ${baseUrl}`);
}

async function main() {
  if (!existsSync(".next/BUILD_ID")) {
    throw new Error("Missing build output. Run npm run build before npm run e2e:auth.");
  }

  const child = spawn("npm", ["run", "start", "--", "--hostname", "127.0.0.1", "--port", String(port)], {
    env: {
      ...process.env,
      AUTH_DATA_MODE: process.env.AUTH_DATA_MODE || "memory",
      NODE_ENV: "production",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => process.stdout.write(chunk));
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));

  try {
    await waitForServer();

    const demoEmail = "demo@kidscarlab.com";
    const demoPassword = "demo1234";

    const missingAccount = await request("/account");
    if (![307, 308].includes(missingAccount.response.status)) {
      throw new Error(`Expected /account to redirect before login, got ${missingAccount.response.status}`);
    }

    const missingLocation = missingAccount.response.headers.get("location") || "";
    if (!missingLocation.includes("reason=missing")) {
      throw new Error(`Expected missing-account redirect to carry reason=missing, got ${missingLocation}`);
    }

    const loginNotice = await request(missingLocation);
    const loginNoticeHtml = await loginNotice.response.text();
    const hasMissingNotice =
      loginNoticeHtml.includes("Please sign in before accessing your account.") ||
      loginNoticeHtml.includes("请先登录后访问用户中心。") ||
      loginNoticeHtml.includes("请先登录后访问用户中心");

    if (!hasMissingNotice) {
      throw new Error("Login page did not render the missing-session notice.");
    }

    const hasGuestNav =
      (loginNoticeHtml.includes("Register") && loginNoticeHtml.includes("Login")) ||
      (loginNoticeHtml.includes("注册") && loginNoticeHtml.includes("登录"));

    if (!hasGuestNav) {
      throw new Error("Login page did not render the expected guest navigation links.");
    }

    const login = await request(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      },
      new Map(),
    );

    if (login.response.status !== 200) {
      const body = await login.response.text();
      throw new Error(`Login failed with ${login.response.status}: ${body}`);
    }

    const authedMe = await request("/api/auth/me", {}, login.jar);
    if (authedMe.response.status !== 200) {
      throw new Error(`Expected /api/auth/me to return 200 after login, got ${authedMe.response.status}`);
    }

    const authedMeBody = await authedMe.response.json();
    if (!authedMeBody.authed || authedMeBody.user?.email !== demoEmail) {
      throw new Error("Auth state endpoint did not report the demo user after login.");
    }

    const authedAccount = await request("/account", {}, login.jar);
    if (authedAccount.response.status !== 200) {
      throw new Error(`Expected authed /account to return 200, got ${authedAccount.response.status}`);
    }

    const accountHtml = await authedAccount.response.text();
    if (!accountHtml.includes(demoEmail)) {
      throw new Error("Authed account page did not include the demo email.");
    }

    if (!accountHtml.includes("ID:")) {
      throw new Error("Authed account page did not render the expected profile block.");
    }

    const logout = await request("/api/auth/logout", { method: "POST" }, authedAccount.jar);
    if (logout.response.status !== 200) {
      throw new Error(`Logout failed with ${logout.response.status}`);
    }

    const afterLogoutMe = await request("/api/auth/me", {}, logout.jar);
    const afterLogoutBody = await afterLogoutMe.response.json();
    if (afterLogoutBody.authed !== false) {
      throw new Error("Auth state endpoint still reported logged-in after logout.");
    }

    const afterLogout = await request("/account", {}, logout.jar);
    if (![307, 308].includes(afterLogout.response.status)) {
      throw new Error(`Expected /account to redirect after logout, got ${afterLogout.response.status}`);
    }

    const afterLogoutLocation = afterLogout.response.headers.get("location") || "";
    if (!afterLogoutLocation.includes("reason=missing")) {
      throw new Error(`Expected logout redirect to point back to login with reason=missing, got ${afterLogoutLocation}`);
    }

    console.log("E2E auth smoke passed.");
  } finally {
    child.kill("SIGTERM");
    await new Promise((resolve) => child.on("exit", resolve));
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});