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


