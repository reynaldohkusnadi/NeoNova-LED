"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/a11y/usePrefersReducedMotion";
import type gsapType from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type Cleanup = () => void;

interface CreateOptions {
  onReady: (api: {
    gsap: typeof gsapType;
    ScrollTrigger: typeof ScrollTriggerType;
  }) => Cleanup | void;
}

let registered = false;

export function useGsapScrollTrigger() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cleanupsRef = useRef<Cleanup[]>([]);

  useEffect(() => {
    return () => {
      // Run and clear any queued cleanups (StrictMode-safe)
      cleanupsRef.current.forEach((fn) => {
        try {
          fn();
        } catch {
          // ignore
        }
      });
      cleanupsRef.current = [];
    };
  }, []);

  async function ensureGsap(): Promise<{
    gsap: typeof gsapType;
    ScrollTrigger: typeof ScrollTriggerType;
  }> {
    const [gsapMod, stMod] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
    const gsap = (gsapMod as unknown as { default: typeof gsapType }).default;
    const ScrollTrigger = (stMod as unknown as { ScrollTrigger: typeof ScrollTriggerType }).ScrollTrigger;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    return { gsap, ScrollTrigger };
  }

  async function create({ onReady }: CreateOptions): Promise<void> {
    if (prefersReducedMotion) return; // Respect reduced motion
    const { gsap, ScrollTrigger } = await ensureGsap();
    let killed = false;

    const cleanup = onReady({ gsap, ScrollTrigger }) || (() => {});

    const safeCleanup: Cleanup = () => {
      if (killed) return;
      killed = true;
      try {
        cleanup();
      } finally {
        // Also kill all triggers created for safety if needed
        try {
          ScrollTrigger.getAll().forEach((t) => t.kill());
        } catch {
          // ignore
        }
      }
    };
    cleanupsRef.current.push(safeCleanup);
  }

  return { create } as const;
}


