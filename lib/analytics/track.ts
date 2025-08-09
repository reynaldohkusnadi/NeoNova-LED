export interface AnalyticsEvent {
  name: string;
  props?: Record<string, unknown>;
}

function isTouch(): boolean {
  if (typeof window === "undefined") return false;
  // Best-effort device modality detection
  return (
    // @ts-expect-error legacy safari
    !!window.ontouchstart || navigator.maxTouchPoints > 0 || navigator.pointerEnabled === true
  );
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const common = {
    path: location.pathname,
    ts: Date.now(),
    deviceType: isTouch() ? "touch" : "pointer",
  };
  const payload = { ...common, ...(event.props ?? {}) };
  // Reason: Stub for future integration with Vercel Analytics or a custom endpoint.
  try {
    // Example Vercel Analytics shim if present
    // @ts-expect-error optional
    window.va?.track?.(event.name, payload);
  } catch {
    // no-op
  }
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event.name, payload);
  }
}
