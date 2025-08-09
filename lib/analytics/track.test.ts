import { describe, it, expect, beforeEach, vi } from "vitest";
import { __resetAnalyticsDedupeForTests, track } from "./track";

declare global {
  interface Window {
    va?: { track?: (name: string, payload: Record<string, unknown>) => void };
  }
}

describe("track helper", () => {
  beforeEach(() => {
    __resetAnalyticsDedupeForTests();
    // stub analytics
    window.va = { track: vi.fn() };
  });

  it("guards on server and adds common fields on client", () => {
    track("cta_click_primary", { extra: 1 });
    expect(window.va?.track).toHaveBeenCalledTimes(1);
    const call = (window.va?.track as unknown as jest.Mock).mock.calls[0] as [
      string,
      { path: string; ts: number; deviceType: string; extra: number }
    ];
    expect(call[0]).toBe("cta_click_primary");
    expect(call[1].path).toBeDefined();
    expect(call[1].ts).toBeDefined();
    expect(["touch", "pointer"]).toContain(call[1].deviceType);
    expect(call[1].extra).toBe(1);
  });

  it("dedupes first-visibility events", () => {
    track("hero_view", { section: "hero" });
    track("hero_view", { section: "hero" });
    expect(window.va?.track).toHaveBeenCalledTimes(1);
    // different section or id should emit
    track("hero_view", { section: "hero", id: "X" });
    expect(window.va?.track).toHaveBeenCalledTimes(2);
  });
});


