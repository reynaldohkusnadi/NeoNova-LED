"use client";

import { useEffect, useState } from "react";

/**
 * Detects OS-level reduced motion preference.
 * - Defaults to true before mount (SSR-safe) to avoid creating animations prematurely
 * - Updates on preference changes via media query listener
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(Boolean(mql.matches));
    onChange();
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Older Safari fallback
    const legacyMql = mql as unknown as {
      addListener?: (cb: () => void) => void;
      removeListener?: (cb: () => void) => void;
    };
    legacyMql.addListener?.(onChange);
    return () => legacyMql.removeListener?.(onChange);
  }, []);

  return prefersReducedMotion;
}


