# Neo Nova — Full-Stack Architecture
**Version:** v1  
**Date:** August 8, 2025  
**Scope:** Sections 1–4 (Overview, Frontend, Backend, Infrastructure)

---

## 1) Architecture Overview & Tenets

### Purpose
Define a lean, reliable system to power a **single-page, lead-gen site** with premium motion (GSAP) and a lightweight WebGL hero, deployed on **Vercel** with **Next.js 14 (App Router)**. Backend surface is minimal: **Server Actions** for form handling + email delivery; everything else is static.

### High-Level Decisions
- **Rendering model:** RSC-first with **Client Components** only where needed (Hero3D, Carousel, SlideOverForm).
- **3D strategy:** Start with **minimal Three.js core** (tree-shaken) to render a **procedural cylinder**; hard fallback to a static hero image when `prefers-reduced-motion` or WebGL unsupported. Initial 3D payload budget **≤ 1.2 MB**.
- **Motion layer:** **GSAP + ScrollTrigger**, loaded via `dynamic import()` and gated by a global `usePrefersReducedMotion()` hook. All pinned/scroll timelines are destroyable/garbage-free.
- **Content:** Version-controlled source in `/content/site.ts` (no CMS in v1). Typed schema ensures exactly **3 cards** + **2 stats**.
- **Lead handling:** **Server Action** validates with **Zod**, sends email via **Resend** (or SMTP fallback), logs analytics events client-side. Spam protection via **honeypot + rate limit**.
- **Analytics/observability:** **Vercel Web Analytics** events + **Speed Insights** for field CWV; optional Sentry later.
- **Security & privacy:** HTTPS only, secrets via **Vercel Encrypted Env Vars**, SPF/DKIM for deliverability, basic **CSP**.
- **Performance:** Aggressive code-split; app shell JS ≤ **140 KB gzip**; images via `next/image`; no animation tick > **50 ms**; CLS ≤ **0.01**.

### System Context (bird’s-eye)
```mermaid
flowchart LR
  U[User Browser] -->|HTTPS| FE[Next.js 14 on Vercel]
  subgraph FE [Frontend (Vercel Edge/CDN)]
    C1[/Static Assets & RSC/]
    CC[Client Components: Hero3D, Carousel, SlideOverForm]
    GA[Vercel Web Analytics]
  end

  CC -->|Server Action POST| SA[(Vercel Serverless)]
  SA -->|Email| RES[Resend/SMTP]
  SA -->|Rate-limit check| KV[(Vercel KV - optional)]
  U -->|OG/SEO| FE
  U -->|Event dispatch| GA
```

### Non-Goals (v1)
- No CMS, no multi-language, no server-stored analytics, no complex APIs.

### Rationale
This architecture is the smallest thing that can win: static-first, one serverless path for the form, analytics handled client-side through Vercel, and a **contained 3D** experience behind strict budgets and fallbacks. It matches the PRD’s performance, a11y, and reliability constraints while leaving clear v2 paths (CMS, case studies, richer 3D).

---

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

### Rationale
This splits concerns cleanly: RSC controls structure and content; Clients handle the small, necessary patches of interactivity and animation. The motion/3D pieces are sandboxed behind hooks, budgets, and fallbacks so they can’t poison performance or accessibility. Analytics is centralized and schema’d so your funnels stay trustworthy.

---

## 3) Backend & Integrations (Server Actions, Email, Anti-Spam, Secrets, Future CMS)

### 3.1 Server Action: `submitLead`
- **Purpose:** Accept form POST (Name, Work Email, Company, WhatsApp), validate, send email, return JSON for optimistic UI.
- **Runtime:** Vercel serverless function (Node 20).  
- **Validation:** **Zod** schema (client + server). Soft-warn free email domains; still allow submit.
- **Rate Limiting:** Per-IP/session guard (in-memory per-instance + optional Vercel KV for global).  
- **Spam Guard:** Honeypot field, minimal time-to-submit check (>800ms), user agent sanity.  
- **Delivery:** **Resend** (preferred) with domain auth (SPF/DKIM). Fallback SMTP (Nodemailer) via provider creds.

```ts
// app/actions/submitLead.ts
'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  whatsapp: z.string().min(7),
  // hidden bot trap:
  website: z.string().max(0).optional() // honeypot
});

export async function submitLead(raw: FormData) {
  const data = Object.fromEntries(raw) as Record<string, string>;
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { ok: false, message: 'Invalid form.' };

  // simple rate limit (upgrade to KV-backed if needed)
  // await checkRateLimit(getClientFingerprint());

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: 'Neo Nova <sales@neonova.com>',
      to: process.env.SALES_EMAIL!,
      subject: 'New Neo Nova Lead',
      html: renderHtml(parsed.data), // small inline template
      text: renderText(parsed.data)
    });
    return { ok: true };
  } catch (e) {
    // Optional: log to analytics and suggest WA fallback in UI
    return { ok: false, message: 'Send failed, please try WhatsApp or email us.' };
  }
}
```

> **Note:** Keep template minimal (no React Email in v1) to avoid bundle bloat. Move to React Email in v2 if you need branded layouts.

### 3.2 Email Delivery & Domain Auth
- **Provider:** **Resend** (DKIM/SPF + domain verification).  
- **From:** `sales@neonova.com` (or subdomain like `mail.neonova.com` to isolate DNS).  
- **Deliverability:** Align envelope-from, DKIM selector, and SPF includes; DMARC policy `p=quarantine` (tighten post-launch).  
- **Fallback:** SMTP (Nodemailer) creds stored as Vercel Encrypted Env Vars.

**Env Vars**
- `RESEND_API_KEY`
- `SALES_EMAIL` (destination inbox)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (fallback only)

### 3.3 Rate Limiting & Abuse Controls
- **v1:** In-function sliding window (per IP/session) with short TTL; block rapid repeats (e.g., >5 / 10min).  
- **Optional v1.1:** **Vercel KV** to make limits global across regions.  
- **Signals:** Honeypot hit → discard silently; sub-800ms submission → raise suspicion; malformed UA → strict path.

### 3.4 Secrets & Config Management
- **Storage:** Vercel **Encrypted Environment Variables** (no secrets in repo).  
- **Separation:** Different values for Preview vs Production.  
- **Rotation:** Replace keys if leaked; Resend + SMTP creds managed via provider console.  
- **Access:** Only the Server Action reads sensitive keys; never expose to client.

### 3.5 Observability (Backend)
- **Structured logs** on server failures (status, error code, elapsed ms).  
- **Analytics parity:** On successful send, client fires `form_submit_success`; on failure, `form_submit_error`.  
- **Optional:** Add Sentry (later) for error grouping; not required for v1.

### 3.6 Security Headers & CSP (Site-wide)
- **HSTS**: `max-age=15552000; includeSubDomains; preload` (after verifying HTTPS across subdomains).  
- **Referrer-Policy**: `strict-origin-when-cross-origin`.  
- **X-Content-Type-Options**: `nosniff`.  
- **Permissions-Policy**: lock down sensors/camera/microphone (none needed).  
- **CSP (starter)**: 
  - `default-src 'self';`
  - `script-src 'self' 'unsafe-inline' 'unsafe-eval' vercel.live;` *(tighten once GSAP/analytics verified)*
  - `img-src 'self' data: https:;`
  - `style-src 'self' 'unsafe-inline';`
  - `connect-src 'self' https://api.resend.com;`
  - **Note:** Adjust for Vercel Analytics endpoint + any remote images (next/image `remotePatterns`).

### 3.7 Future CMS Path (v2+)
- **Trigger:** When you need case studies/blog or non-developer copy edits.  
- **Options:** 
  1) **Contentlayer** (git-based, fast, low vendor friction).  
  2) **Sanity** (hosted studio, real-time, image pipeline).  
  3) **Dato/Contentful** (rigid models, enterprise-friendly).
- **Migration plan:** Keep `/content/site.ts` as adapter; introduce `getContent()` that first tries CMS, falls back to static object. Maintain types.

### 3.8 WhatsApp Deep Link (Optional Path)
- After success, show a **“Continue in WhatsApp”** button that opens `wa.me/<number>?text=<prefill>`.  
- Emits `whatsapp_deeplink` event. Always keep email path as the primary deliverability channel.

### 3.9 Backend Acceptance Criteria
- **Validation & Spam:** Zod schema enforced; honeypot active; sub-800ms bot timing rejected or flagged.  
- **Rate Limit:** Blocks abusers without affecting legit users (document threshold).  
- **Email:** Resend path succeeds with DKIM/SPF configured; SMTP fallback available; p50 **< 800ms** end-to-end.  
- **Secrets:** No secrets in client bundles; envs present in Preview/Prod.  
- **Headers:** HSTS, Referrer-Policy, XCTO, Permissions-Policy shipped; CSP baseline configured and documented.  
- **Observability:** Failures return friendly error; logs capture error class + elapsed; analytics fires `form_submit_*` accordingly.

### Rationale
A single **Server Action** keeps the backend surface tiny and cheap while still giving you reliable lead delivery. We protect it with **validation + honeypot + rate limits** (upgradeable to KV). Email runs through **Resend** for deliverability with a vendor-agnostic SMTP escape hatch. Baseline headers/CSP give you sensible security without fighting the animation stack.

---

## 4) Infrastructure & Deployment Topology (Vercel)

### 4.1 DNS, Domains & TLS
- **Domains:** `neonova.com` (prod), `staging.neonova.com` (preview alias).  
- **DNS:** Prefer **Vercel-managed DNS** for instant certs and zero-downtime swaps.  
- **TLS:** Auto HTTPS via Vercel; enable **HSTS** after verifying subdomains:  
  `Strict-Transport-Security: max-age=15552000; includeSubDomains; preload`.

### 4.2 Environments & Branching
- **Git flow:** PR → **Preview Deployment**; `main` → **Production** (protected, required checks).  
- **Branch aliases:** Optional `staging` alias that always points to latest approved preview.  
- **Rollbacks:** Use Vercel’s instant **Promote/Rollback** to any previous deployment.

### 4.3 Build, CI & Quality Gates
- **Runtime:** Node 20; Next.js 14 (App Router).  
- **CI steps (Preview & Prod):**
  1) `pnpm install && pnpm typecheck && pnpm lint`  
  2) **Lighthouse CI** (desktop + Moto G4 emulation) → **Perf ≥ 90**  
  3) **axe-core** a11y check → **no criticals**  
  4) Bundle guard (app shell JS gzip ≤ **140 KB**; 3D payload budget report)  
- **Block merges** if gates fail; only allow **override with approval**.

### 4.4 Edge Network, Regions & Latency
- **Static/RSC** served from Vercel **Edge CDN** globally.  
- **Server Actions** (form): run in closest region to users.  
  - **Preferred region:** `sin1` (SEA proximity) given Jakarta timezone; fallback `iad1` for global.  
  - If most traffic is SEA, pin region to `sin1` to reduce p50.

### 4.5 Security Headers & CSP (Next.js config)
```ts
// next.config.ts
export default {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains; preload" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Start permissive for dev; tighten after GSAP/analytics verified
          { key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: https:",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' vercel.live",
              "connect-src 'self' https://api.resend.com",
            ].join('; ')
          }
        ],
      },
    ];
  },
};
```
> Adjust `script-src`/`connect-src` for Vercel Analytics endpoint and any remote `next/image` hosts you allow via `remotePatterns`.

### 4.6 Caching, ISR & Assets
- **Pages:** Static by default; no CMS calls in v1.  
- **Future fetched content:** use `revalidate: 86400` (24h) at fetch call sites.  
- **Images:** `next/image` + Vercel Image Optimization; **immutable** for hashed assets.  
- **3D assets:** Long-max-age + hashed URLs; keep first-load set under **1.2 MB**.  
- **Headers:** `Cache-Control: public, max-age=0, s-maxage=31536000, immutable` for static assets.

### 4.7 Secrets & Config (per environment)
- **Env vars:** `RESEND_API_KEY`, `SALES_EMAIL`, `WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`, and SMTP fallbacks.  
- **Storage:** Vercel **Encrypted Env Vars**; never committed.  
- **Separation:** Distinct Preview vs Production values; rotate if leaked.  
- **Access:** Only Server Action touches secrets.

### 4.8 Observability, Alerts & SLOs
- **Web Analytics:** Event taxonomy from PRD §6.7; validate dedupe in preview.  
- **Speed Insights:** Weekly review; alert if any CWV leaves “Good”.  
- **Server logs:** Capture error class + latency for `submitLead`; page to Slack/email if **>0.5%** errors in 24h.  
- **SLOs:** p50 **< 800ms** for form action; availability **>99.9%**/30d.

### 4.9 Acceptance Criteria (Infra)
- Preview/Prod environments live; **zero secret leaks** (env audit passes).  
- DNS cutover complete; HTTPS + HSTS active; CSP baseline shipped.  
- CI gates enforce Perf≥90 & a11y no-criticals; bundle budgets reported per build.  
- Static assets cached immutably; hero textures fingerprinted.  
- Server Action pinned to SEA region (or documented decision otherwise).  
- Rollback tested successfully at least once pre-launch.

### Rationale
This keeps ops dead simple: **Vercel does the heavy lifting** (CDN, TLS, rollbacks), while we harden the edges with CI gates, sane security headers, and strict caching. Locking a nearby region for the one serverless hop keeps the form snappy for SEA users.
