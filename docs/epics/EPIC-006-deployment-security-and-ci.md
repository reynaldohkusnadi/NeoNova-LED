# EPIC-006 — Deployment, Security & CI

Status: Approved
Owner: Tech Lead
Timeline: Sprint 1–2

## Goal
Establish reliable Preview/Prod deployments on Vercel with security headers, CSP baseline, and CI quality gates enforced.

## Outcomes
- Preview and Production environments configured; domain & HTTPS ready.
- Next.js `headers()` returns baseline security headers + CSP.
- CI: typecheck, lint, Lighthouse CI (≥90), axe-core (no criticals), bundle budgets.

## Scope
- Vercel project setup, domains, env vars separation (Preview vs Prod).
- Next.js security headers & CSP per Architecture §4.5.
- CI workflow enforcing gates and budgets.

## Out of Scope
- Advanced Sentry/alerts (future).

## Dependencies
- EPIC-001 (foundation), EPIC-004 (env vars)
- Architecture §4.1–4.9; PRD §8

## Risks
- Overly strict CSP blocking GSAP/analytics; start permissive then tighten.

## Story Outline
1. Configure Vercel project, domains, HTTPS, HSTS
2. Implement headers/CSP in `next.config.ts`
3. Add CI workflow with Lighthouse CI and axe-core
4. Document deploy, rollback, and env management in README

## Acceptance Criteria
- Preview/Prod deploys pass CI gates by default; override requires approval.
- Security headers present; CSP baseline working with motion/analytics.
- Rollback tested at least once before launch.

## References
- Architecture §4.1–4.9
- PRD §8
