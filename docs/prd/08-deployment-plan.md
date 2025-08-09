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
