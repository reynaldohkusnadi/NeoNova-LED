export type EventName =
  | "hero_view"
  | "hero_interact"
  | "carousel_view"
  | "carousel_card_focus"
  | "carousel_swipe"
  | "results_band_view"
  | "stat_reveal"
  | "cta_click_primary"
  | "cta_click_secondary"
  | "form_open"
  | "form_submit_success"
  | "form_submit_error"
  | "whatsapp_deeplink";

function isTouch(): boolean {
  if (typeof window === "undefined") return false;
  // Best-effort device modality detection
  return (
    // @ts-expect-error legacy safari
    !!window.ontouchstart || navigator.maxTouchPoints > 0 || navigator.pointerEnabled === true
  );
}

const DEDUPE_EVENTS: Set<EventName> = new Set([
  "hero_view",
  "carousel_view",
  "results_band_view",
]);

const emittedOnceKeys = new Set<string>();

function makeDedupeKey(name: EventName, path: string, props?: Record<string, unknown>): string {
  // Include id/section when present to scope dedupe to entity
  const section = props && typeof props.section === "string" ? props.section : "";
  const id = props && typeof props.id === "string" ? props.id : "";
  return `${name}|${path}|${section}|${id}`;
}

export function __resetAnalyticsDedupeForTests(): void {
  emittedOnceKeys.clear();
}

export function track(name: EventName, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const common = {
    path: location.pathname,
    ts: Date.now(),
    deviceType: isTouch() ? "touch" : "pointer",
  };
  const payload = { ...common, ...(props ?? {}) };

  if (DEDUPE_EVENTS.has(name)) {
    const key = makeDedupeKey(name, common.path, props);
    if (emittedOnceKeys.has(key)) return;
    emittedOnceKeys.add(key);
  }
  // Reason: Stub for future integration with Vercel Analytics or a custom endpoint.
  try {
    // Example Vercel Analytics shim if present
    // @ts-expect-error optional
    window.va?.track?.(name, payload);
  } catch {
    // no-op
  }
  const debugEnv = process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === "1";
  const debugQuery = (() => {
    try {
      const sp = new URLSearchParams(location.search);
      const dbg = sp.get("debug");
      return typeof dbg === "string" && dbg.includes("analytics");
    } catch {
      return false;
    }
  })();
  if (process.env.NODE_ENV === "development" || debugEnv || debugQuery) {
    console.info("[analytics]", name, payload);
  }
}
