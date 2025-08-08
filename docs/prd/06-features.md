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


