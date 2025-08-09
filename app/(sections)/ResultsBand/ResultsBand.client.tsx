"use client";

import { useEffect, useRef } from "react";
import { useGsapScrollTrigger } from "@/lib/motion/useGsapScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/a11y/usePrefersReducedMotion";
import { track } from "@/lib/analytics/track";

export function ResultsBandReveal() {
  const prefersReduced = usePrefersReducedMotion();
  const { create } = useGsapScrollTrigger();
  const didViewRef = useRef(false);

  useEffect(() => {
    if (prefersReduced) return;
    create({
      onReady: ({ gsap, ScrollTrigger }) => {
        const region = document.querySelector(
          "[data-results-band]",
        ) as HTMLElement | null;
        if (!region) return;
        const values = Array.from(
          region.querySelectorAll<HTMLElement>("[data-stat-value]"),
        );
        const initial = values.map((el) => el.textContent || "0");
        // simple fade/scale in
        gsap.fromTo(
          values,
          { opacity: 0, y: 8, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          },
        );

        // optional count-up
        const numbers = values.map((el) => ({ el, n: 0 }));
        const st = ScrollTrigger.create({
          trigger: region,
          start: "top 85%",
          once: true,
          onEnter: () => {
            if (!didViewRef.current) {
              track("results_band_view", { section: "results_band" });
              didViewRef.current = true;
            }
            numbers.forEach(({ el }, i) => {
              const target = initial[i];
              if (!target) return;
              const numeric = parseFloat(target);
              if (!isFinite(numeric)) return;
              const state = { v: 0 } as { v: number };
              gsap.fromTo(
                state,
                { v: 0 },
                {
                  v: numeric,
                  duration: 1,
                  ease: "power1.out",
                  onUpdate: () => {
                    el.textContent = Math.round(state.v).toString();
                  },
                },
              );
              const stat = el.parentElement?.querySelector(".opacity-70") as HTMLElement | null;
              const label = stat?.textContent || "";
              if (label) track("stat_reveal", { section: "results_band", id: label });
            });
          },
        });

        return () => {
          st.kill();
        };
      },
    });
  }, [prefersReduced, create]);

  return null;
}
