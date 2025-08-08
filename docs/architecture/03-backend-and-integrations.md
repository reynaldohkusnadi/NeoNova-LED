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


