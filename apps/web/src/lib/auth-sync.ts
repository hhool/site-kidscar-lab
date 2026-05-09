export const AUTH_EVENT = "kcl:auth-change";
export const AUTH_SYNC_KEY = "kcl:auth-sync";

export function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));

  try {
    localStorage.setItem(AUTH_SYNC_KEY, String(Date.now()));
  } catch {
    // Ignore localStorage failures and keep same-tab event behavior.
  }
}
