## 9. Risks & Dependencies

### 9.1 Key Risks & Mitigations

- **WebGL / GPU Variability (Mobile Safari, low-end Android)**
  - _Impact:_ Broken/slow hero, poor first impression.
  - _Mitigation:_ Feature-detect → static hero image; cap initial 3D payload ≤ **1.2 MB**; progressive effects; QA on iOS Safari + mid Android; error boundary to swap fallback.

- **Performance Regressions from Pinning/Scroll Animations**
  - _Impact:_ Jank during scroll; CWV degradation (INP/LCP).
  - _Mitigation:_ Lazy-load GSAP/ScrollTrigger; avoid layout thrash (measure→mutate); no tick > **50 ms**; reduce pin durations on mobile; throttle listeners; test with Speed Insights weekly.

- **Accessibility Gaps with Motion & Focus**
  - _Impact:_ Keyboard traps; motion sickness for sensitive users.
  - _Mitigation:_ Honor `prefers-reduced-motion` (disable pin/scrub); visible focus styles; focus management in slide-over; axe-core pass; acceptance bars set in §§3 & 7.

- **Analytics Under/Over-Counting**
  - _Impact:_ Unreliable funnel data → bad decisions.
  - _Mitigation:_ Central `track(event,payload)` with dedupe; test event fire in Preview; naming spec fixed (see §6.7); compare against server-side form counts after launch week.

- **Email Deliverability (Server Action → Sales Inbox)**
  - _Impact:_ Lost leads.
  - _Mitigation:_ Use Resend/SMTP with verified domain (SPF/DKIM); fallback provider; log `form_submit_success` with server receipt; on failure, enqueue + alert.

- **Spam & Abuse on Lead Form**
  - _Impact:_ Noisy data, wasted time.
  - _Mitigation:_ Honeypot + IP/session rate-limit; server-side validation; optional lightweight challenge if spikes detected.

- **Claim Substantiation (80% / 25%)**
  - _Impact:_ Credibility/legal risk if challenged.
  - _Mitigation:_ Add “indicative industry study” footnote in v1; plan v2 case-study page with sourced data; allow easy copy swap in `/content/site.ts`.

- **Scope Creep (CMS, i18n, case studies)**
  - _Impact:_ Timeline/cost blowout.
  - _Mitigation:_ Non-goals locked in §2.4; change control = new PRD rev.

- **3D Expertise & Timeline**
  - _Impact:_ Delays on hero quality/perf.
  - _Mitigation:_ Start with static fallback + subtle parallax; add WebGL hero behind feature flag; iterate after perf budget verified.

### 9.2 External Dependencies (Versions/Contracts)

- **GSAP + ScrollTrigger** (pinning): version pinned; license validated.
- **WebGL / (optional) Three.js**: keep minimal; only core; version pinned.
- **Next.js 14 / Node 20 / Vercel**: App Router, Server Actions, Image Opt, Web Analytics, Speed Insights.
- **Tailwind / Inter via `next/font`**: pinned minor versions.
- **WhatsApp deeplink**: device/app availability varies; secondary email path always present.

### 9.3 Assumptions

- Single-page v1; no CMS; copy in `/content/site.ts`.
- Audience uses evergreen browsers (iOS 16+, Android 11+).
- Domain + email provider ready for DKIM/SPF before launch.
- Staging → Preview → Production workflow on Vercel.

### 9.4 Go/No-Go Criteria (Launch Gate)

- §2.3 metrics configured; §4.9 / §7.5 **Acceptance Criteria met**.
- Speed Insights “Good” CWV after 7-day ramp.
- Form deliverability tested end-to-end (success + failure paths).
- Accessibility checks: Lighthouse A11y ≥ **95**, no critical axe-core issues.
