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


