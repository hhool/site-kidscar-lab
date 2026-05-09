const FALLBACK_SITE_URL = "http://127.0.0.1:3010";

function normalizeBaseUrl(input: string | undefined): string {
  if (!input) {
    return FALLBACK_SITE_URL;
  }

  const normalized = input.trim().replace(/\/+$/, "");
  if (!normalized) {
    return FALLBACK_SITE_URL;
  }

  try {
    const url = new URL(normalized);
    return `${url.protocol}//${url.host}`;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
