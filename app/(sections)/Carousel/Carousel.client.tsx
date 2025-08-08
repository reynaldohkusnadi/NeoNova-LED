"use client";

import { useEffect } from "react";
import { useGsapScrollTrigger } from "@/lib/motion/useGsapScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/a11y/usePrefersReducedMotion";

export function CarouselReveal() {
  const prefersReduced = usePrefersReducedMotion();
  const { create } = useGsapScrollTrigger();

  useEffect(() => {
    if (prefersReduced) return;
    create({
      onReady: ({ gsap, ScrollTrigger }) => {
        const section = document.querySelector("[data-carousel]");
        if (!section) return;
        const cards = Array.from(section.querySelectorAll("article"));
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }
        );
        const st = ScrollTrigger.create({ trigger: section, start: "top 85%", once: true });
        return () => st.kill();
      },
    });
  }, [prefersReduced, create]);

  return null;
}


