# Neo Nova — Product Requirements Document (PRD)

**Version:** v1  
**Date:** August 8, 2025  
**Scope:** Sections 1–9

---

## 1. Overview & Vision

**Product Name:** Neo Nova — Cylindrical LED Indoor Advertising Platform

**Vision Statement:**  
Neo Nova revolutionizes indoor advertising with a cutting-edge, flexible, and transparent cylindrical LED display that captures attention from every angle. Designed for high-traffic commercial environments, it combines immersive visuals, interactive motion, and measurable impact to transform passive foot traffic into active engagement and sales.

**Problem Statement:**  
Traditional indoor signage often struggles to stand out in cluttered visual environments. Static or flat digital displays are limited by their viewing angles, visual novelty, and slow update cycles, resulting in missed engagement opportunities and reduced ROI.

**Solution Summary:**  
Neo Nova delivers a 3D cylindrical LED format with 360° visibility, real-time content updates, and scroll-triggered interactive storytelling. Integrated analytics provide measurable performance data, ensuring marketing teams can prove and improve campaign effectiveness without costly physical updates.

**Target Audience:**

- Retailers and mall tenants seeking high-impact in-store promotion
- Brand advertisers in high-traffic commercial spaces
- Event venues and experiential marketers
- Agencies seeking innovative display formats for client campaigns

**Key Differentiators:**

- Cylindrical design for complete 360° visibility
- Transparent, flexible LED technology preserving architectural aesthetics
- Real-time content updates without added operational costs
- Built-in analytics for ROI measurement
- Premium motion design powered by GSAP + ScrollTrigger

---

## 2. Goals & Success Metrics

### 2.1 Business Goals (priority-ordered)

1. **Generate qualified leads** for Neo Nova sales.
2. **Demonstrate product differentiation** (360° cylindrical LED, transparent/flexible tech).
3. **Validate ROI claims** with clear, trackable on-site interactions.
4. **Ship a performant, reliable marketing site** on Vercel that’s easy to iterate.

### 2.2 User Goals

- Quickly understand **what Neo Nova is** and why it’s different.
- See **proof of impact** (stats, case-style messaging).
- **Contact sales** fast via slide-over form or WhatsApp deep link.
- Browse smoothly with **delightful motion** that never harms accessibility.

### 2.3 Success Metrics & Targets (SMART)

**Acquisition & Engagement**

- ≥ **2.5% form submit rate** (Form opens → successful submit) in first 30 days.
- ≥ **8% CTA click-through** (any primary/secondary CTA → form open).
- ≥ **60% hero engagement** (scroll past pinned hero or interact with 3D controls).
- ≥ **55% carousel engagement** (swipe/drag or card focus) on first session.

**Credibility & Narrative**

- ≥ **70% scroll depth** reaching the Results Band on first session.
- ≥ **1.2 avg. card detail reveals** per user (per-card reveal/hover/focus events).

**Performance & Reliability**

- **Core Web Vitals: “Good”** for LCP, CLS, INP across field data (Vercel Speed Insights).
- **Lighthouse ≥ 90** (Performance) on mid-range Android & desktop.
- **Initial 3D payload ≤ 1.2 MB**; route-level TTI under 3.5s on Fast 3G emulation.
- **Error rate < 0.1%** for Server Actions (form processing) in first 30 days.
- **> 99.9% availability** (static site + serverless form action) over 30 days.

**Analytics Coverage**

- 100% of the following events tracked in **Vercel Web Analytics** with consistent naming:
  - `hero_view`, `hero_interact`
  - `carousel_view`, `carousel_card_focus`, `carousel_swipe`
  - `results_band_view`, `stat_reveal`
  - `form_open`, `form_submit_success`, `form_submit_error`
  - `cta_click_primary`, `cta_click_secondary`, `whatsapp_deeplink`

### 2.4 Non-Goals (Out of Scope for v1)

- Full CMS integration (content will live in `/content/site.ts` for v1).
- Multi-language localization (English-only v1).
- Case-study engine or blog.
- E-commerce checkout (lead-gen only).

---

## 3. Design & UX Requirements

### 3.1 Visual Language

- **Look & Feel:** Oversized stacked hero, minimal navbar (one primary CTA), link-card grid aesthetics; long-scroll narrative anchored by a **3D cylindrical LED hero**.
- **Color & Tokens:**
  - `--color-primary: #9997FF` (Light Blue)
  - `--color-neutral-50: #EDEEF5` (Light)
  - `--color-ink: #282C32` (Near Black)
  - `--color-black: #000000`
  - Token groups: `--radius-2xl`, `--shadow-md/lg`, `--space-xs…xl`, `--z-modal`, `--opacity-muted`.
  - **Note:** Final HEX palette will be swapped from the extracted deck tokens during build step “Add tokens”.
- **Typography:** Inter via `next/font`; sizes scaled for **stacked hero headline** (≥ clamp(40px, 6vw, 88px)), subhead (≥ 18–22px), body (16–18px).
- **Imagery/3D:** Procedural cylinder (lazy-loaded `<canvas>`), reduced-motion image fallback; next/image for all raster assets with sizes/remotePatterns configured.

### 3.2 Interaction & Motion (GSAP + ScrollTrigger)

- **Hero:** `pin: true`, subtle camera dolly, `power2.out`, `scrub: 0.5`.
- **Carousel:** Vertical scroll drives horizontal translate; per-card fade/translate reveals; magnetic cursor on **cards + CTAs only**.
- **Results Band:** Pinned; numerals **count-up**; scale 0.9→1 on enter.
- **Reduced Motion:** Respect `prefers-reduced-motion` → disable pin/scrub; swap static hero; keep minimal fades only.
- **Performance Guardrails:** 60fps target on mid-range Android; no long main-thread tasks (>50ms) from animations.

### 3.3 Accessibility (WCAG 2.2 AA)

- **Contrast:** Text on `#282C32` vs `#EDEEF5` passes AA; primary CTA on light backgrounds must meet AA (adjust shade if needed).
- **Focus & Input:** Visible focus rings on all interactives; keyboard-reachable carousel controls; escape to close slide-over; no keyboard traps.
- **Targets:** Min interactive size **44×44px**; hit-area padding allowed.
- **Announcements:** Form success/error states announced via `aria-live="polite"`; slide-over sets `aria-modal`, focus trapped within.
- **Motion Sensitivity:** All parallax/pin effects disabled when reduced-motion is set; provide non-animated equivalents.

### 3.4 Navigation & IA (single page)

- Minimal top nav with one **primary CTA** (“Request pricing”); secondary CTA available (“Get in touch”).
- Sections: Hero → 3-card Carousel → Proven Impact (aux) → Results Band → Slide-Over Form.
- Sticky/fixed nav never overlaps focus or hero controls; nav height ≤ 72px.

### 3.5 Forms & Feedback

- **Slide-Over Form:** Fields = Name, Work Email, Company, WhatsApp. Server Action submit with optimistic UI; success toast + optional `wa.me` deep link (prefill text).
- **Validation:** Client + server validation; Work Email must be business domain (soft warn if free mailbox, allow override).
- **Errors:** Inline messages tied to inputs via `aria-describedby`; submit disabled during in-flight; retry on recoverable errors.

### 3.6 Device & Browser Support

- **Targets:** Evergreen Chrome, Safari, Firefox, Edge; iOS 16+, Android 11+.
- **Fallbacks:** Static hero image when WebGL unavailable; carousel still scrollable via touch/keyboard arrows.

### 3.7 Design Acceptance Criteria (V1)

- All animated sections obey `prefers-reduced-motion`.
- Every interactive element reachable via keyboard with **visible** focus.
- Lighthouse **Accessibility ≥ 95** on desktop & mobile.
- Slide-over opens/closes with ESC and trap/focus works; screen readers announce open/close.
- Count-up animation never blocks interaction or causes layout shift > 0.01 CLS.
- Primary CTA visible above the fold on common breakpoints (≥ 390×844, 1440×900).

---

## 4. Technical Requirements

### 4.1 Architecture & Framework

- **Framework:** Next.js **14** (App Router) with React Server Components; selective Client Components for animated/interactive UI.
- **Structure:** `app/` routes; co-located components; shared **/content/site.ts** as single source of copy truth.
- **State & Data:** Static content import from `/content`; no CMS in v1. Server Actions handle form POST (no API route).
- **3D Hero:** WebGL `<canvas>` (minimal pipeline; **Three.js optional**). Lazy load + feature-detect → static image fallback when unsupported.

### 4.2 Libraries & Utilities

- **Motion:** GSAP + ScrollTrigger (lazy `dynamic import()` on first need).
- **UI:** Tailwind, Inter via `next/font`.
- **A11y Helpers:** Focus trap for slide-over; `aria-live` announcements; custom hook for `prefers-reduced-motion`.
- **Analytics:** Vercel Web Analytics `<Analytics />` + custom event dispatcher (`track(event, payload)`).

### 4.3 Deployment & Hosting (Vercel)

- **Env:** Preview → Production workflow.
- **Speed Insights:** Enabled for CWV monitoring over time.
- **Caching/ISR:** Static by default; for `/content/site.ts` edits, use `revalidate(86400)` where applicable (or rebuild on change).
- **Images:** `next/image` + Vercel Optimization; `remotePatterns` configured; `sizes` set per breakpoint.

### 4.4 Forms & Server Actions

- **Fields:** Name, Work Email, Company, WhatsApp (required).
- **Validation:** Zod schema (client + server); soft warning for free-mail domains.
- **Processing:** Server Action → (v1) send email to sales inbox **TBD** and log analytics `form_submit_success`; optional **wa.me** deep link using prefill text.
- **Spam Control:** Honeypot field + simple rate-limit (IP/session) on Server Action.

### 4.5 Performance Targets (enforced)

- First-load **3D payload ≤ 1.2 MB**; meshes/textures precompressed.
- Animation work off main thread where possible; **no long tasks > 50 ms** from animation ticks.
- **Lighthouse ≥ 90** (Perf) on desktop + mid-range Android.
- **CWV Good** (field): LCP, CLS, INP via Speed Insights.

### 4.6 Accessibility & SEO Tech

- **A11y:** `prefers-reduced-motion` respected globally; focus-visible styles; keyboard paths for carousel and slide-over; ESC to close.
- **SEO:** Route metadata, Open Graph/Twitter tags, valid landmarks; canonical URL; sitemap/robots.
- **i18n:** Not in v1 (single language).

### 4.7 Observability & Error Handling

- **Events:** `hero_view`, `hero_interact`, `carousel_view`, `carousel_card_focus`, `carousel_swipe`, `results_band_view`, `stat_reveal`, `cta_click_primary`, `cta_click_secondary`, `form_open`, `form_submit_success`, `form_submit_error`, `whatsapp_deeplink`.
- **Client Errors:** Console-silenced for known recoverables; user-friendly toasts; retry on transient Server Action failures.
- **Availability:** Target **>99.9%** over 30 days (static-first + lightweight serverless).

### 4.8 Security & Privacy

- **Data:** Only lead data submitted via form; no client PII stored locally beyond session.
- **Transport:** HTTPS only; no third-party trackers beyond Vercel Analytics.
- **Secrets:** Email/SMTP (or Resend) keys via Vercel Encrypted Env Vars.

### 4.9 Acceptance Criteria (Technical)

- Builds and deploys on Vercel with **Preview** + **Production**—no runtime errors.
- All analytics events fire with consistent naming and payloads.
- Server Action validates, emails sales (TBD), returns success within **<800 ms p50**.
- `prefers-reduced-motion` disables GSAP pin/scrub and serves static hero image.
- `next/image` configured with `remotePatterns`; all images have explicit `sizes`.
- Form is keyboard-accessible, announces success/error via `aria-live`.
- Initial 3D bundle size verified ≤ 1.2 MB; Speed Insights shows CWV = Good within 7 days of launch.

---

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
  cardsCore: [Card, Card, Card]; // exactly 3 for v1
  cardsAux: Card[]; // optional extras (e.g., Proven Impact)
  stats: [Stat, Stat]; // exactly 2 for v1
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
      "Discover a revolutionary cylindrical LED screen—flexible, transparent, captivating attention from every angle.",
  },
  cardsCore: [
    {
      id: "whyNeoNova",
      eyebrow: "Technology",
      headline: "Cutting-Edge LED Innovation",
      blurbShort:
        "Flexible, transparent screens designed for immersive, dynamic visuals. Capture your audience’s attention like never before.",
      blurbLong:
        "Neo Nova introduces an advanced flexible and transparent LED solution...",
    },
    {
      id: "visibility360",
      eyebrow: "Design",
      headline: "Impossible to Ignore",
      blurbShort:
        "A cylindrical design ensuring your content is seen from all directions, maximizing viewer engagement.",
      blurbLong: "Our cylindrical form delivers true 360-degree visibility...",
    },
    {
      id: "dynamicContent",
      eyebrow: "Operations",
      headline: "Update Content Instantly",
      blurbShort:
        "Refresh your advertising campaign in real-time, delivering timely messages without additional costs.",
      blurbLong:
        "Publish timely offers, switch creative for events, or localize messages on the fly...",
    },
  ],
  cardsAux: [
    {
      id: "provenImpact",
      eyebrow: "Impact",
      headline: "Proven to Boost Sales",
      blurbShort:
        "80% consumer purchase rate, 25% sales uplift—drive measurable ROI with innovative digital signage.",
      blurbLong: "Digital signage influences consumer behavior...",
    },
  ],
  stats: [
    { id: "purchaseInfluence", value: 80, suffix: "%", label: "Purchase Influence" },
    { id: "salesUplift", value: 25, suffix: "%", label: "Sales Uplift" },
  ],
  form: {
    success: "Thank you – we’ll get in touch!",
    ctaPrimary: "Request pricing",
    ctaSecondary: "Get in touch",
    whatsappPrefill:
      "Hello Neo Nova — I’m interested in pricing for the cylindrical LED. Please contact me via email/WhatsApp.",
  },
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

---

## 6. Features (with acceptance criteria)

### 6.1 NavbarMinimal

**Description:** Minimal top nav with one **primary CTA** (Request pricing) and optional **secondary CTA** (Get in touch). Sticky on scroll.
**Acceptance Criteria**

- Renders CTAs from `content.form` (no hardcoded strings).
- Sticky header ≤ 72px; never overlaps keyboard focus or hero controls.
- `cta_click_primary` / `cta_click_secondary` fire on click with `{ location: "navbar" }`.
- Works with keyboard (TAB/SHIFT+TAB); visible focus styles.

### 6.2 Hero3D

**Description:** Pinned 3D cylindrical LED hero with subtle camera dolly; image fallback for reduced motion or no WebGL.
**Acceptance Criteria**

- Loads 3D lazily after first paint; **first 3D payload ≤ 1.2 MB**.
- `prefers-reduced-motion` → static image, no pin/scrub; still shows headline/subhead.
- Pin behavior via ScrollTrigger (`scrub:0.5`, easing `power2.out`), no CLS > 0.01.
- Emits `hero_view` on first viewport enter; `hero_interact` on any 3D control interaction (if present).
- Keyboard focus does not get trapped while pinned.

### 6.3 CardCarousel (3 core cards)

**Description:** Vertically-driven horizontal carousel (3 cards) with momentum drag; per-card reveal animations; magnetic cursor on cards/CTAs (desktop only).
**Acceptance Criteria**

- Exactly **3 cards** from `content.cardsCore`; order preserved.
- Vertical scroll drives horizontal translate; touch/drag enabled.
- Magnetic cursor only on desktop; disabled on mobile/touch.
- Keyboard-accessible: left/right arrows move focus; ENTER activates CTA.
- Emits: `carousel_view` (first visibility), `carousel_card_focus` (id), `carousel_swipe` with `{ direction, distance }`.

### 6.4 Proven Impact (aux slot)

**Description:** Optional fourth surface (card **or** intro block) sourced from `content.cardsAux[0]`.
**Acceptance Criteria**

- If `cardsAux[0]` exists, renders; if not, layout collapses with no gap.
- If rendered as **card**, it participates in carousel and emits the same events.
- If rendered as **intro block**, it appears before Results Band and emits `results_band_intro_view`.

### 6.5 ResultsBand (2 stats)

**Description:** Two pinned stat panels with count-up and subtle scale on enter.
**Acceptance Criteria**

- Reads exactly **2 stats** from `content.stats` (value + suffix + label).
- Count-up animation never blocks interaction; animation time ≤ 1.2s per stat.
- Emits `results_band_view` on first pin; `stat_reveal` per stat with `{ id }`.
- No layout shift > 0.01 when numbers animate.

### 6.6 SlideOverForm

**Description:** Slide-over lead form (Name, Work Email, Company, WhatsApp); Server Action submit; success toast + optional WhatsApp deep link.
**Acceptance Criteria**

- Client + server validation (Zod); Work Email soft-warns on free domains but allows submit.
- Server Action sends email to sales inbox **(env var TBD)** and returns success within **< 800ms p50**.
- Emits `form_open`, `form_submit_success` / `form_submit_error`; on WhatsApp action, `whatsapp_deeplink`.
- Accessible: focus trap, ESC closes, `aria-modal`, `aria-live="polite"` messages.
- Rate limiting + honeypot protect against spam.

### 6.7 Analytics & Event Dispatcher

**Description:** Vercel Web Analytics + lightweight `track(event, payload)` helper.
**Acceptance Criteria**

- `<Analytics />` mounted once at root; no duplicate events.
- Events implemented:  
  `hero_view`, `hero_interact`,  
  `carousel_view`, `carousel_card_focus`, `carousel_swipe`,  
  `results_band_view`, `stat_reveal`,  
  `cta_click_primary`, `cta_click_secondary`,  
  `form_open`, `form_submit_success`, `form_submit_error`,  
  `whatsapp_deeplink`.
- Payloads include `{ path, ts, deviceType, section, id? }` as applicable.

### 6.8 GSAP Hooks & Reduced Motion

**Description:** Reusable hooks `useGsapScrollTrigger`, `usePrefersReducedMotion`.
**Acceptance Criteria**

- All animated sections read from `usePrefersReducedMotion` and **disable pin/scrub** when true.
- ScrollTrigger timelines created/destroyed on mount/unmount; no memory leaks (verified in React StrictMode).
- No single animation tick > 50ms (dev tools Performance).

### 6.9 Images & Media

**Description:** `next/image` with `remotePatterns` and `sizes`.
**Acceptance Criteria**

- All images have `sizes` and width/height to avoid CLS.
- Remote textures/hero assets optimized and cacheable via Vercel.
- No image larger than necessary for its breakpoint (manual audit).

### 6.10 Error & Empty States

**Description:** Graceful handling across key components.
**Acceptance Criteria**

- If content arrays are missing/short (during dev), components render placeholders and log dev-only warnings.
- Form failure shows retry CTA; analytics logs `form_submit_error`.

---

## 7. Performance, Accessibility & SEO

### 7.1 Performance Budget & Tactics

**Budgets**

- **App shell JS (gzip)** ≤ **140 KB** (excludes 3D hero libs/assets).
- **Initial 3D payload** (libs + meshes + textures) ≤ **1.2 MB** total.
- **Largest single image** ≤ **250 KB** at its target breakpoint.
- **Font transfer** via `next/font` (Inter) ≤ **80 KB** total.

**Tactics**

- **Code-split heavy libs**: `dynamic import()` GSAP/ScrollTrigger, Three/WebGL helpers, and SlideOverForm.
- **Tree-shake** GSAP plugins; load **ScrollTrigger only**.
- **Idle hydration** for non-critical client components; **defer** analytics dispatch.
- **next/image** with AVIF/WebP where supported; explicit `sizes` and intrinsic `width/height`.
- **Font optimization**: `display: optional`, preconnect to Vercel asset host, subset latin only.
- **HTTP caching**: static assets immutable; hero textures with long max-age; HTML static by default.
- **Main-thread discipline**: no animation tick > **50 ms**; avoid synchronous layout thrash (measure→mutate pattern).
- **Preload**: critical OG image + above-the-fold hero fallback; **no** eager 3D until first paint.

**Monitors**

- Vercel **Speed Insights** for field CWV; Lighthouse CI in preview for regressions.

### 7.2 Accessibility (WCAG 2.2 AA)

- **Reduced motion**: Respect `prefers-reduced-motion` across all animations; provide static hero.
- **Focus management**: Always-visible focus rings, logical order; trap focus in slide-over; ESC closes.
- **Hit targets**: ≥ **44×44 px** interactive areas.
- **Announcements**: `aria-live="polite"` for form success/error; slide-over `aria-modal` + `role="dialog"`.
- **Color contrast**: Text on `#282C32` vs `#EDEEF5` meets AA; verify CTAs on all backgrounds.
- **Keyboard parity**: Carousel, CTAs, and close actions fully operable without pointer.

### 7.3 SEO & Social Sharing

- **Meta**: Per-route title/description; canonical URL.
- **Open Graph / Twitter**: OG image **≥ 1200×630**, stable URL; `twitter:card` large summary.
- **Structured Data (JSON-LD)**:
  - `Organization` (Neo Nova) with `contactPoint`.
  - Optional `Product` snippet describing the cylindrical LED (non-pricing v1).
- **sitemap.xml & robots.txt**: Preview = `noindex`; Production = indexable.
- **Favicons & theme-color**: Provide full icon set; set `theme-color` to `--color-ink`.

### 7.4 Core Web Vitals & Targets

- **Field CWV (Good)**: LCP, INP, CLS across Chrome UX Report.
- **Lighthouse ≥ 90** Performance (desktop + mid-range Android).
- **INP p75 < 200 ms** on Production after the first 7 days.
- **CLS p75 ≤ 0.01** (animations must not shift layout).

### 7.5 Acceptance Criteria

- First contentful paint not blocked by 3D; 3D loads lazily after first paint.
- App shell JS ≤ 140 KB gzip; 3D bundle ≤ 1.2 MB total on first load.
- All images specify `sizes` and intrinsic dimensions; no unexpected CLS from media.
- `prefers-reduced-motion` disables pin/scrub everywhere; static hero rendered.
- 100% interactive elements keyboard-operable with visible focus; Axe core: **no critical violations**.
- Meta title/description present; canonical, sitemap, robots configured; OG image validated.
- JSON-LD passes Google Rich Results test (Organization; Product optional).
- Speed Insights shows **Good** CWV within 7 days of launch.

---

## 8. Deployment Plan (Vercel)

### 8.1 Environments & Branching

- **Preview** for every PR; **Production** on `main` (protected branch, required checks passing).
- Instant **rollback** to any previous deployment.

### 8.2 Build & Runtime

- **Next.js 14 (App Router)** on Node 20; edge network by default.
- `<Analytics />` enabled; **Speed Insights** turned on for field CWV.

### 8.3 Secrets & Config

- `NEXT_PUBLIC_SITE_URL` (prod/stage), `SALES_EMAIL` (TBD), `RESEND_API_KEY` _or_ SMTP creds (if emailing), `WHATSAPP_NUMBER` (optional).
- Use **Vercel Encrypted Env Vars**; no secrets in repo.

### 8.4 Domains & Routing

- `neonova.com` (prod) + `staging.neonova.com` (preview alias).
- Auto HTTPS; canonical URL set per env.

### 8.5 Caching & ISR

- Static by default; images via **Vercel Image Optimization**.
- Any fetched copy (if added later) uses `revalidate(86400)`; otherwise static import from `/content/site.ts`.

### 8.6 Monitoring & Logging

- **Web Analytics** events as defined (Section 6.7).
- **Speed Insights** monitored weekly; create regression ticket if metrics degrade.
- Error logs for Server Action failures; alert threshold: >0.5% error rate in 24h.

### 8.7 Post-Deploy Checklist

- Run Lighthouse on preview (desktop + mid Android) → **≥90 Perf**.
- Validate JSON-LD; verify OG image; crawl `sitemap.xml`.
- Check `form_submit_success` events and inbox deliverability.

---

## 9. Risks & Dependencies

### 9.1 Key Risks & Mitigations

- **WebGL / GPU Variability (Mobile Safari, low-end Android)**
  - _Impact:_ Broken/slow hero, poor first impression.
  - _Mitigation:_ Feature-detect → static hero image; cap initial 3D payload ≤ **1.2 MB**; progressive effects; QA on iOS Safari + mid Android; error boundary to swap fallback.

- **Performance Regressions from Pinning/Scroll Animations**
  - _Impact:_ Jank during scroll; CWV degradation (INP/LCP).
  - _Mitigation:_ Lazy-load GSAP/ScrollTrigger; avoid layout thrash (measure→mutate); no tick > **50 ms**; reduce pin durations on mobile; throttle listeners; test with Speed Insights weekly.

- **Accessibility Gaps with Motion & Focus**
  - _Impact:_ Keyboard traps; motion sickness for sensitive users.
  - _Mitigation:_ Honor `prefers-reduced-motion` (disable pin/scrub); visible focus styles; focus management in slide-over; axe-core pass; acceptance bars set in §§3 & 7.

- **Analytics Under/Over-Counting**
  - _Impact:_ Unreliable funnel data → bad decisions.
  - _Mitigation:_ Central `track(event,payload)` with dedupe; test event fire in Preview; naming spec fixed (see §6.7); compare against server-side form counts after launch week.

- **Email Deliverability (Server Action → Sales Inbox)**
  - _Impact:_ Lost leads.
  - _Mitigation:_ Use Resend/SMTP with verified domain (SPF/DKIM); fallback provider; log `form_submit_success` with server receipt; on failure, enqueue + alert.

- **Spam & Abuse on Lead Form**
  - _Impact:_ Noisy data, wasted time.
  - _Mitigation:_ Honeypot + IP/session rate-limit; server-side validation; optional lightweight challenge if spikes detected.

- **Claim Substantiation (80% / 25%)**
  - _Impact:_ Credibility/legal risk if challenged.
  - _Mitigation:_ Add “indicative industry study” footnote in v1; plan v2 case-study page with sourced data; allow easy copy swap in `/content/site.ts`.

- **Scope Creep (CMS, i18n, case studies)**
  - _Impact:_ Timeline/cost blowout.
  - _Mitigation:_ Non-goals locked in §2.4; change control = new PRD rev.

- **3D Expertise & Timeline**
  - _Impact:_ Delays on hero quality/perf.
  - _Mitigation:_ Start with static fallback + subtle parallax; add WebGL hero behind feature flag; iterate after perf budget verified.

### 9.2 External Dependencies (Versions/Contracts)

- **GSAP + ScrollTrigger** (pinning): version pinned; license validated.
- **WebGL / (optional) Three.js**: keep minimal; only core; version pinned.
- **Next.js 14 / Node 20 / Vercel**: App Router, Server Actions, Image Opt, Web Analytics, Speed Insights.
- **Tailwind / Inter via `next/font`**: pinned minor versions.
- **WhatsApp deeplink**: device/app availability varies; secondary email path always present.

### 9.3 Assumptions

- Single-page v1; no CMS; copy in `/content/site.ts`.
- Audience uses evergreen browsers (iOS 16+, Android 11+).
- Domain + email provider ready for DKIM/SPF before launch.
- Staging → Preview → Production workflow on Vercel.

### 9.4 Go/No-Go Criteria (Launch Gate)

- §2.3 metrics configured; §4.9 / §7.5 **Acceptance Criteria met**.
- Speed Insights “Good” CWV after 7-day ramp.
- Form deliverability tested end-to-end (success + failure paths).
- Accessibility checks: Lighthouse A11y ≥ **95**, no critical axe-core issues.
