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
  /** Optional auxiliary cards; first element may drive Proven Impact aux slot */
  cardsAux?: [Card];
  form: {
    success: string;
    ctaPrimary: string;
    ctaSecondary: string;
    whatsappPrefill: string;
  };
}

export const content = {
  headline: "The Future of Indoor Advertising",
  blurbShort:
    "Discover a revolutionary cylindrical LED screen—flexible, transparent, captivating attention from every angle.",
  cardsCore: [
    {
      id: "whyNeoNova",
      headline: "Cutting-Edge LED Innovation",
      blurbShort:
        "Flexible, transparent screens designed for immersive, dynamic visuals. Capture your audience’s attention like never before.",
      ctaLabel: "Learn more",
    },
    {
      id: "visibility360",
      headline: "Impossible to Ignore",
      blurbShort:
        "A cylindrical design ensuring your content is seen from all directions, maximizing viewer engagement.",
      ctaLabel: "Learn more",
    },
    {
      id: "dynamicContent",
      headline: "Update Content Instantly",
      blurbShort:
        "Refresh your advertising campaign in real-time, delivering timely messages without additional costs.",
      ctaLabel: "Learn more",
    },
  ],
  stats: [
    { label: "Purchase Influence", value: "80%" },
    { label: "Sales Uplift", value: "25%" },
  ],
  cardsAux: [
    {
      id: "provenImpact",
      headline: "Proven to Boost Sales",
      blurbShort:
        "80% consumer purchase rate, 25% sales uplift—drive measurable ROI with innovative digital signage.",
      ctaLabel: "Learn more",
    },
  ],
  form: {
    success: "Thank you – we’ll get in touch!",
    ctaPrimary: "Request pricing",
    ctaSecondary: "Get in touch",
    whatsappPrefill:
      "Hello Neo Nova — I’m interested in pricing for the cylindrical LED. Please contact me via email/WhatsApp.",
  },
} as const satisfies Content;
