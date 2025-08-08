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


