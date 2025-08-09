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
