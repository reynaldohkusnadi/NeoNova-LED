export interface AnalyticsEvent {
  name: string;
  props?: Record<string, unknown>;
}

export function track(event: AnalyticsEvent): void {
  // Reason: Stub for future integration with Vercel Analytics or a custom endpoint.
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event.name, event.props ?? {});
  }
}


