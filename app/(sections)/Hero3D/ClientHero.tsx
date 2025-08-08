"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/a11y/usePrefersReducedMotion";
import { useGsapScrollTrigger } from "@/lib/motion/useGsapScrollTrigger";
import StaticHero from "./StaticHero";

interface ClientHeroProps {
  headline: string;
  blurb: string;
}

function isWebGL2Supported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

function isLowEndDevice(): boolean {
  const navWithMem = navigator as Navigator & { deviceMemory?: number };
  const mem = navWithMem.deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 0;
  if (mem !== undefined && mem < 4) return true;
  if (cores && cores < 4) return true;
  return false;
}

export default function ClientHero({ headline, blurb }: ClientHeroProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [supported, setSupported] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { create } = useGsapScrollTrigger();

  useEffect(() => {
    // Feature detect client-side
    if (prefersReduced) {
      setSupported(false);
      return;
    }
    const ok = isWebGL2Supported() && !isLowEndDevice();
    setSupported(ok);
  }, [prefersReduced]);

  useEffect(() => {
    if (!supported) return;
    // Minimal, no-heavy timeline example gated by reduced motion
    create({
      onReady: ({ gsap, ScrollTrigger }) => {
        if (!containerRef.current) return;
        const tl = gsap.timeline({ paused: false });
        tl.fromTo(
          containerRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom top",
          toggleActions: "play none none reverse",
          animation: tl,
        });

        return () => {
          st.kill();
          tl.kill();
        };
      },
    });
  }, [supported, create]);

  if (supported === null) {
    // During detection, render static to avoid layout shift
    return <StaticHero headline={headline} blurb={blurb} />;
  }

  if (!supported) {
    return <StaticHero headline={headline} blurb={blurb} />;
  }

  // Placeholder container representing 3D canvas mount (avoid importing heavy libs for now)
  return (
    <section className="w-full max-w-5xl mx-auto py-16">
      <div ref={containerRef} className="rounded-xl border p-8 text-center">
        <h2 className="text-3xl font-semibold mb-3">{headline}</h2>
        <p className="opacity-80 mb-4">{blurb}</p>
        <div
          aria-label="3D hero canvas placeholder"
          className="h-[320px] rounded-lg bg-[color-mix(in_oklab,var(--background)_85%,black)]"
        />
      </div>
    </section>
  );
}
