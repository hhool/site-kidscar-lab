// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { AUTH_EVENT, AUTH_SYNC_KEY, emitAuthChange } from "@/lib/auth-sync";

describe("auth-sync cross-tab behavior", () => {
  it("emitAuthChange should dispatch local event and write localStorage marker", () => {
    const listener = vi.fn();
    window.addEventListener(AUTH_EVENT, listener);

    emitAuthChange();

    expect(listener).toHaveBeenCalledTimes(1);
    const marker = window.localStorage.getItem(AUTH_SYNC_KEY);
    expect(marker).toBeTruthy();

    window.removeEventListener(AUTH_EVENT, listener);
  });
});
