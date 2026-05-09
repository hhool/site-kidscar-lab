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

    const authedAccount = await request("/account", {}, login.jar);
    if (authedAccount.response.status !== 200) {
      throw new Error(`Expected authed /account to return 200, got ${authedAccount.response.status}`);
    }

    const accountHtml = await authedAccount.response.text();
    if (!accountHtml.includes(demoEmail)) {
      throw new Error("Authed account page did not include the demo email.");
    }

    const logout = await request("/api/auth/logout", { method: "POST" }, authedAccount.jar);
    if (logout.response.status !== 200) {
      throw new Error(`Logout failed with ${logout.response.status}`);
    }

    const afterLogout = await request("/account", {}, logout.jar);
    if (![307, 308].includes(afterLogout.response.status)) {
      throw new Error(`Expected /account to redirect after logout, got ${afterLogout.response.status}`);
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