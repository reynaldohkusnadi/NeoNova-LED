# EPIC-004 — Lead Capture & Server Action

Status: Approved
Owner: Backend/FE Lead
Timeline: Sprint 2

## Goal
Implement SlideOverForm with Zod validation and a Server Action that delivers email via Resend (SMTP fallback), with spam/rate-limiting and a11y.

## Outcomes
- SlideOverForm client component (Name, Work Email, Company, WhatsApp).
- `submitLead` Server Action with Zod validation, honeypot, simple rate limit.
- Email delivery via Resend; SMTP fallback; env vars documented.

## Scope
- Client + server validation; soft-warn free-mail domains.
- Analytics events: `form_open`, `form_submit_success/error`, `whatsapp_deeplink`.
- Optional WhatsApp deep link on success.

## Out of Scope
- CMS or persistent storage.

## Dependencies
- EPIC-001 (env/README), EPIC-002 (components), EPIC-003 (hooks optional)
- PRD §§3.5, 4.4, 6.6; Architecture §§3.1–3.5

## Risks
- Email deliverability; mitigate via DKIM/SPF setup, fallback SMTP, error analytics.

## Story Outline
1. Build SlideOverForm with a11y (focus trap, aria-live, ESC close)
2. Implement `submitLead` Server Action with validation + honeypot + rate limit
3. Integrate Resend; document envs and fallback SMTP
4. Emit analytics; add optional WhatsApp deep link

## Acceptance Criteria
- p50 < 800ms Server Action; success and failure paths verified.
- A11y: focus trap, aria-live messages work; keyboard-only path clean.
- Events emitted per PRD §6.7; no duplicates.

## References
- PRD §§3.5, 4.4, 6.6–6.7
- Architecture §§3.1–3.5
