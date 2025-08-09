"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/a11y/usePrefersReducedMotion";
import { useGsapScrollTrigger } from "@/lib/motion/useGsapScrollTrigger";
import StaticHero from "./StaticHero";
import { track } from "@/lib/analytics/track";

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
  const didViewRef = useRef(false);

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
    if (!didViewRef.current) {
      track("hero_view", { section: "hero" });
      didViewRef.current = true;
    }
    if (!supported) return;
    // Enhanced timeline: staggered headline reveal + card scale on scroll
    create({
      onReady: ({ gsap, ScrollTrigger }) => {
        if (!containerRef.current) return;

        const scope = containerRef.current;
        const heading = scope.querySelector("h2");
        const sub = scope.querySelector("p");

        const tl = gsap.timeline({ paused: true });
        if (heading) {
          const text = heading.textContent || "";
          heading.innerHTML = text
            .split("")
            .map((c) => `<span class="inline-block will-change-transform">${c}</span>`) // safe enough for demo copy
            .join("");
          const chars = heading.querySelectorAll("span");
          tl.fromTo(
            chars,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.02, ease: "power3.out" },
            0,
          );
        }
        if (sub) {
          tl.fromTo(
            sub,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            0.2,
          );
        }

        const st = ScrollTrigger.create({
          trigger: scope,
          start: "top 85%",
          end: "bottom top",
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(),
          onLeaveBack: () => tl.pause(0),
        });

        // Mouse parallax on foreground card
        const onMove = (e: MouseEvent) => {
          const rect = scope.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / rect.width;
          const dy = (e.clientY - cy) / rect.height;
          gsap.to(scope, {
            rotateX: dy * -4,
            rotateY: dx * 6,
            duration: 0.3,
            ease: "power2.out",
          });
        };
        scope.addEventListener("mousemove", onMove);

        return () => {
          scope.removeEventListener("mousemove", onMove);
          st.kill();
          tl.kill();
          gsap.set(scope, { clearProps: "transform" });
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
        <h2 className="text-3xl font-semibold mb-3 will-change-transform">{headline}</h2>
        <p className="opacity-80 mb-4 text-shimmer will-change-transform">{blurb}</p>
        <div
          aria-label="3D hero canvas placeholder"
          className="h-[320px] rounded-lg bg-[color-mix(in_oklab,var(--background)_85%,black)]"
        />
      </div>
    </section>
  );
}
