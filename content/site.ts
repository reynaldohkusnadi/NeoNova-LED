/**
 * Authoring workflow:
 * - Edit this file in a feature branch via PR.
 * - Preview will deploy and render content from this file only (no hardcoded strings in components).
 * - Once approved, merge to main; Production reads the same typed export.
 */
export interface Card {
  id: string;
  headline: string;
  blurbShort: string;
  ctaLabel: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Content {
  headline: string;
  blurbShort: string;
  cardsCore: [Card, Card, Card];
  stats: [Stat, Stat];
  form: {
    success: string;
    ctaPrimary: string;
    ctaSecondary: string;
    whatsappPrefill: string;
  };
}

export const content = {
  headline: "Neo Nova: Accelerate product impact",
  blurbShort:
    "We build high‑performance web experiences with motion, 3D, and analytics baked in.",
  cardsCore: [
    {
      id: "speed",
      headline: "Blazing performance",
      blurbShort: "Ship fast experiences that convert.",
      ctaLabel: "See results",
    },
    {
      id: "motion",
      headline: "Meaningful motion",
      blurbShort: "Enhance clarity with delightful motion.",
      ctaLabel: "View work",
    },
    {
      id: "quality",
      headline: "Quality guardrails",
      blurbShort: "CI gates for accessibility and speed.",
      ctaLabel: "How it works",
    },
  ],
  stats: [
    { label: "Lighthouse", value: "90+" },
    { label: "Axe criticals", value: "0" },
  ],
  form: {
    success: "Thanks! We'll be in touch shortly.",
    ctaPrimary: "Request demo",
    ctaSecondary: "Chat on WhatsApp",
    whatsappPrefill: "Hi Neo Nova team — I'd love to learn more.",
  },
} as const satisfies Content;


