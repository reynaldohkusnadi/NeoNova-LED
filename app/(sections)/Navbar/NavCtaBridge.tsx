"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/track";

/**
 * Mount-only bridge that wires Navbar CTA anchors to open the SlideOver form.
 * Keeps `NavbarMinimal` as an RSC by attaching listeners via data attributes.
 */
export default function NavCtaBridge(): null {
  useEffect(() => {
    function handleClick(ev: Event) {
      const target = ev.currentTarget as HTMLAnchorElement | null;
      if (!target) return;
      ev.preventDefault();
      const kind = target.dataset.analyticsEvent ?? "cta_click";
      track({ name: String(kind) });
      // Announce intent to open form
      const openEvent = new CustomEvent("nn:openSlideOver", {
        detail: { source: kind },
      });
      window.dispatchEvent(openEvent);
    }

    const primary = document.querySelector('a[data-analytics-event="cta_click_primary"]');
    const secondary = document.querySelector(
      'a[data-analytics-event="cta_click_secondary"]',
    );

    primary?.addEventListener("click", handleClick);
    secondary?.addEventListener("click", handleClick);

    return () => {
      primary?.removeEventListener("click", handleClick);
      secondary?.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
