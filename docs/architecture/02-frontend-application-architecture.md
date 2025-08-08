## 2) Frontend Application Architecture (Next.js 14 on Vercel)

### 2.1 App Structure & Routing (App Router)
```
app/
  layout.tsx                     # RSC: html/head/body, Analytics mount, theme/tokens
  page.tsx                       # RSC: assembles sections; imports typed content
  (sections)/
    Hero3D/ClientHero.tsx        # Client: WebGL + GSAP wrapper (lazy)
    Hero3D/StaticHero.tsx        # RSC: reduced-motion/static fallback
    Carousel/ClientCarousel.tsx  # Client: drag/scroll + reveals
    ResultsBand/ClientResults.tsx# Client: count-up + pinned
    Form/SlideOverForm.tsx       # Client: UI + validation
  actions/
    submitLead.ts                # Server Action (Zod validate → Resend/SMTP)
content/
  site.ts                        # Typed copy model (single source of truth)
lib/
  analytics/track.ts             # Client event helper; Vercel Web Analytics
  a11y/usePrefersReducedMotion.ts
  motion/useGsapScrollTrigger.ts # Lazy GSAP+ScrollTrigger setup/teardown
  perf/webglBudget.ts            # Guards for 3D payload & feature detect
styles/
  globals.css, tokens.css        # Tailwind + CSS custom props (palette, radii, z-index)
```
- **Single route** (`/`) in v1; later routes (e.g., `/case-studies`) won’t affect this base layout.
- **RSC-first**: `page.tsx` composes sections and passes typed `content.*` into Client sections when necessary.

### 2.2 Component Ownership & Rendering Boundaries
| Component            | Type    | Ownership (state/side-effects)                            |
|---------------------|---------|-----------------------------------------------------------|
| `NavbarMinimal`     | RSC     | Reads CTAs from `content.form`; client-only click events via small wrapper where needed |
| `Hero3D`            | Client  | WebGL canvas, GSAP pin/dolly; swaps to `StaticHero` on reduced-motion/unsupported |
| `CardCarousel`      | Client  | Scroll-driven horizontal translate, momentum drag, magnetic cursor (desktop only) |
| `ProvenImpact`      | RSC/Client | RSC by default; becomes Client only if animated |
| `ResultsBand`       | Client  | Count-up numbers + scale on enter; emits analytics |
| `SlideOverForm`     | Client  | UI + client validation; calls `actions/submitLead` Server Action |
| `Footer/Meta`       | RSC     | SEO tags, JSON-LD, canonical |

**Guideline:** Only make a component Client when it **needs** browser APIs (animation, WebGL, form interactivity). All copy and layout scaffolding stay in RSC for minimal JS.

### 2.3 State & Data Flow
- **Data source:** `content/site.ts` (typed). Imported directly in RSC and passed as props to Client components.
- **UI state (local only):** form open/close, carousel index, animation flags. Use React state in each Client component—no global store.
- **Server Action:** `submitLead(formData)` returns `{ ok: boolean, message?: string }` for optimistic UI.

### 2.4 Motion System (GSAP + ScrollTrigger)
- **Lazy load**: `const gsap = await import('gsap'); const { ScrollTrigger } = await import('gsap/ScrollTrigger');`
- **Setup/teardown** in `useGsapScrollTrigger(target, options)`; register on mount, `kill()` on unmount; guard against StrictMode double mount.
- **Reduced Motion**: `usePrefersReducedMotion()` returns `true` → skip creating timelines, use minimal CSS transitions.
- **Pinning strategy:** Pin durations shorter on mobile; avoid nested pins; ensure pinned containers have fixed height to prevent CLS.

### 2.5 WebGL Hero Pipeline
- **Feature detect:** `supportsWebGL2()` + device heuristics (block low memory/GPU).
- **Budget:** Load < **1.2 MB** combined (lib + geometry + texture). Prioritize **procedural** geometry and compressed textures.
- **Fallbacks:** 
  - RM on → `StaticHero` (high-res image via `next/image`).
  - WebGL fail → `StaticHero`.
- **Seams:** Keep the 3D hero self-contained; canvas never blocks scroll; no global listeners except via the hook.

### 2.6 Accessibility Architecture
- **Keyboard-first**: Carousel arrow keys, ENTER activates CTA; ESC closes slide-over; focus trapped in modal; visible focus rings.
- **ARIA**: `role="dialog" aria-modal` for slide-over; `aria-live="polite"` for form result toasts.
- **Motion parity**: All GSAP timelines gated by `usePrefersReducedMotion`; number count-up reduced or skipped under RM.

### 2.7 Performance Architecture
- **App shell JS ≤ 140 KB (gzip)** by keeping RSC dominant and code-splitting Clients.
- **Tree-shake** GSAP plugins (only ScrollTrigger) and any Three.js helpers.
- **Idle hydrate** non-critical Clients; defer analytics event wiring until idle.
- **Images**: `next/image` everywhere, explicit `sizes`, dimensioned placeholders; AVIF/WebP first.
- **Main-thread**: Avoid heavy work in tick; measure→mutate; throttle scroll handlers.

### 2.8 Error Handling & Boundaries
- **Client:** ErrorBoundary around Hero/Carousel; on error → analytics `component_error` + safe fallback.
- **Server Action:** Validate (Zod). On failure → user-friendly message + `form_submit_error`. Hard failures: enqueue email retry (future) or prompt WhatsApp fallback.

### 2.9 Telemetry & Analytics Integration
```ts
// lib/analytics/track.ts
export type EventName =
  | 'hero_view' | 'hero_interact'
  | 'carousel_view' | 'carousel_card_focus' | 'carousel_swipe'
  | 'results_band_view' | 'stat_reveal'
  | 'cta_click_primary' | 'cta_click_secondary'
  | 'form_open' | 'form_submit_success' | 'form_submit_error'
  | 'whatsapp_deeplink';

export function track(name: EventName, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  try {
    // attach common fields
    const common = { path: location.pathname, ts: Date.now(), deviceType: isTouch() ? 'touch' : 'pointer' };
    window.va?.track?.(name, { ...common, ...payload }); // Vercel Web Analytics
  } catch { /* no-op */ }
}
```
- **Dedupe** initial visibility events (e.g., `hero_view`) with a WeakSet or ref flag.
- **Naming** locked per PRD §6.7; payloads include `section` and `id` when relevant.

### 2.10 Acceptance Criteria (Architecture)
- `page.tsx` (RSC) composes all sections; only animation/form components are Client.
- Reduced-motion disables pin/scrub and renders `StaticHero`; site remains fully usable.
- 3D hero payload audited ≤ **1.2 MB**; failure path shows static image with no CLS.
- App shell JS audited ≤ **140 KB gzip** on first paint; GSAP/Three only loaded when needed.
- All analytics events fire once per spec; no duplicate mounts; preview deploy verifies events.
- Axe/lighthouse a11y checks ≥ **95**; keyboard parity everywhere.


