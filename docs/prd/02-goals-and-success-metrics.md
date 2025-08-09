## 2. Goals & Success Metrics

### 2.1 Business Goals (priority-ordered)

1. **Generate qualified leads** for Neo Nova sales.
2. **Demonstrate product differentiation** (360° cylindrical LED, transparent/flexible tech).
3. **Validate ROI claims** with clear, trackable on-site interactions.
4. **Ship a performant, reliable marketing site** on Vercel that’s easy to iterate.

### 2.2 User Goals

- Quickly understand **what Neo Nova is** and why it’s different.
- See **proof of impact** (stats, case-style messaging).
- **Contact sales** fast via slide-over form or WhatsApp deep link.
- Browse smoothly with **delightful motion** that never harms accessibility.

### 2.3 Success Metrics & Targets (SMART)

**Acquisition & Engagement**

- ≥ **2.5% form submit rate** (Form opens → successful submit) in first 30 days.
- ≥ **8% CTA click-through** (any primary/secondary CTA → form open).
- ≥ **60% hero engagement** (scroll past pinned hero or interact with 3D controls).
- ≥ **55% carousel engagement** (swipe/drag or card focus) on first session.

**Credibility & Narrative**

- ≥ **70% scroll depth** reaching the Results Band on first session.
- ≥ **1.2 avg. card detail reveals** per user (per-card reveal/hover/focus events).

**Performance & Reliability**

- **Core Web Vitals: “Good”** for LCP, CLS, INP across field data (Vercel Speed Insights).
- **Lighthouse ≥ 90** (Performance) on mid-range Android & desktop.
- **Initial 3D payload ≤ 1.2 MB**; route-level TTI under 3.5s on Fast 3G emulation.
- **Error rate < 0.1%** for Server Actions (form processing) in first 30 days.
- **> 99.9% availability** (static site + serverless form action) over 30 days.

**Analytics Coverage**

- 100% of the following events tracked in **Vercel Web Analytics** with consistent naming:
  - `hero_view`, `hero_interact`
  - `carousel_view`, `carousel_card_focus`, `carousel_swipe`
  - `results_band_view`, `stat_reveal`
  - `form_open`, `form_submit_success`, `form_submit_error`
  - `cta_click_primary`, `cta_click_secondary`, `whatsapp_deeplink`

### 2.4 Non-Goals (Out of Scope for v1)

- Full CMS integration (content will live in `/content/site.ts` for v1).
- Multi-language localization (English-only v1).
- Case-study engine or blog.
- E-commerce checkout (lead-gen only).
