## 5. Content & Information Architecture

### 5.1 Single-Page Structure (v1)
1. **Hero (3D cylinder)** — Pinned on load; stacked headline + subhead from `content.hero`.
2. **Core Cards Carousel (3)** — Why Neo Nova / 360° Visibility / Dynamic Content from `content.cardsCore`.
3. **Proven Impact (aux)** — Either a fourth card **or** intro block before Results Band from `content.cardsAux[0]`.
4. **Results Band (2 stats)** — 80% purchase influence, 25% sales uplift with count-up from `content.stats`.
5. **Slide-Over Form CTA** — “Request pricing / Get in touch.” Uses `content.form`.

### 5.2 Component ↔ Content Map
- `<NavbarMinimal ctaPrimary, ctaSecondary>` → `content.form.ctaPrimary`, `content.form.ctaSecondary`
- `<Hero3D copy>` → `content.hero.headline`, `content.hero.subhead`
- `<CardCarousel items>` → `content.cardsCore` (exactly 3 items in v1)
- **Optional** Proven Impact card/intro → `content.cardsAux[0]`
- `<ResultsBand items>` → `content.stats` (exactly 2 items in v1)
- `<SlideOverForm>` → `content.form.*`

### 5.3 Content Model (source of truth)
Location: `/content/site.ts`

```ts
// /content/site.ts
export interface Card {
  id: string;
  eyebrow: string;
  headline: string;
  blurbShort: string;
  blurbLong: string;
}

export interface Stat {
  id: string;
  value: number;
  suffix?: string;
  label: string;
}

export interface Content {
  hero: { headline: string; subhead: string };
  cardsCore: [Card, Card, Card];          // exactly 3 for v1
  cardsAux: Card[];                        // optional extras (e.g., Proven Impact)
  stats: [Stat, Stat];                     // exactly 2 for v1
  form: {
    success: string;
    ctaPrimary: string;
    ctaSecondary: string;
    whatsappPrefill: string;
  };
}

export const content = {
  hero: {
    headline: "The Future of Indoor Advertising",
    subhead:
      "Discover a revolutionary cylindrical LED screen—flexible, transparent, captivating attention from every angle."
  },
  cardsCore: [
    {
      id: "whyNeoNova",
      eyebrow: "Technology",
      headline: "Cutting-Edge LED Innovation",
      blurbShort:
        "Flexible, transparent screens designed for immersive, dynamic visuals. Capture your audience’s attention like never before.",
      blurbLong:
        "Neo Nova introduces an advanced flexible and transparent LED solution..."
    },
    {
      id: "visibility360",
      eyebrow: "Design",
      headline: "Impossible to Ignore",
      blurbShort:
        "A cylindrical design ensuring your content is seen from all directions, maximizing viewer engagement.",
      blurbLong:
        "Our cylindrical form delivers true 360-degree visibility..."
    },
    {
      id: "dynamicContent",
      eyebrow: "Operations",
      headline: "Update Content Instantly",
      blurbShort:
        "Refresh your advertising campaign in real-time, delivering timely messages without additional costs.",
      blurbLong:
        "Publish timely offers, switch creative for events, or localize messages on the fly..."
    }
  ],
  cardsAux: [
    {
      id: "provenImpact",
      eyebrow: "Impact",
      headline: "Proven to Boost Sales",
      blurbShort:
        "80% consumer purchase rate, 25% sales uplift—drive measurable ROI with innovative digital signage.",
      blurbLong:
        "Digital signage influences consumer behavior..."
    }
  ],
  stats: [
    { id: "purchaseInfluence", value: 80, suffix: "%", label: "Purchase Influence" },
    { id: "salesUplift", value: 25, suffix: "%", label: "Sales Uplift" }
  ],
  form: {
    success: "Thank you – we’ll get in touch!",
    ctaPrimary: "Request pricing",
    ctaSecondary: "Get in touch",
    whatsappPrefill:
      "Hello Neo Nova — I’m interested in pricing for the cylindrical LED. Please contact me via email/WhatsApp."
  }
} as const satisfies Content;
```

**Notes**
- **Schema guarantees** the v1 layout (3 core cards, 2 stats). Adjust to arrays in v2 if you want dynamic counts.
- Use `as const satisfies Content` to keep literal types while enforcing shape.
- Copy updates are code-reviewed PRs. (No CMS in v1.)

### 5.4 Content Editing Workflow
- **Authoring**: Edit `/content/site.ts`, open PR, preview deploy on Vercel.
- **Publishing**: Merge to `main` → Production deploy.  
- **Optional**: If any content is fetched, use `revalidate(86400)`; otherwise static import is preferred for performance.

### 5.5 Copy Guidelines (tone & constraints)
- **Tone**: Confident, concrete, benefit-first; keep jargon minimal.
- **Headlines**: ≤ 6 words when possible; strong verbs.
- **BlurbShort**: ≤ 20–24 words; scannable.
- **BlurbLong**: 1–2 sentences; expand value and context.
- **Claims**: If numeric, must map to a stat or footnote (future case-study page).

### 5.6 Acceptance Criteria (Content/IA)
- Page renders successfully with **exactly 3** `cardsCore` and **2** `stats`; optional `cardsAux[0]` slot supported.
- All components read copy **only** from `/content/site.ts`.
- Navbar pulls CTAs from `content.form` (no hardcoded strings).
- Removing `cardsAux[0]` hides the Proven Impact surface without layout breakage.
- A11y: All text nodes derived from content support screen readers and maintain AA contrast.


