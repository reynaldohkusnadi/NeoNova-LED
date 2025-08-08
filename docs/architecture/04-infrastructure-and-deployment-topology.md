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


