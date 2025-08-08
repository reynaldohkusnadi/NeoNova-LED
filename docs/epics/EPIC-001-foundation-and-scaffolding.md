# EPIC-001 — Foundation & Scaffolding

Status: Approved
Owner: Product Owner (Sarah), Tech Lead
Timeline: Sprint 1

## Goal
Establish a production-ready Next.js 14 foundation with typed content model, baseline a11y/performance guardrails, and developer onboarding so feature work can proceed safely.

## Outcomes
- Repo bootstrapped with Next.js 14 (App Router), Tailwind, Inter via `next/font`.
- Typed content model at `/content/site.ts` matching PRD §5.3.
- Base page structure (RSC-first) rendering sections with placeholders.
- Developer onboarding docs (README, ENV, TESTING) created.
- CI gates (typecheck, lint, Lighthouse CI, axe-core) wired for Preview/Prod.

## Scope
- Project init (Next.js 14, pnpm, TypeScript strict, Tailwind, Prettier, ESLint).
- App shell and section scaffolds per Architecture §2.1.
- Tokens/styles baseline (`styles/*`, CSS custom props).
- Content model and sample content from PRD §5.3.
- Basic analytics mount (`<Analytics />`) placeholder.

## Out of Scope
- Motion/GSAP and 3D hero (EPIC-003).
- Lead form server action (EPIC-004).

## Dependencies
- PRD §§2,5,6,7
- Architecture §§2.1, 2.7, 2.10, 4.3

## Risks
- Over-scoping initial setup; mitigate with strict “placeholders only” commitment.

## Story Outline
1. Initialize repo and toolchain (Next.js 14, pnpm, TS strict, Tailwind, ESLint/Prettier)
2. Create content model `/content/site.ts` and sample content (PRD §5.3)
3. Scaffold app structure and sections (placeholders only)
4. Add base styles/tokens and accessibility defaults
5. Author docs: `README.md`, `ENV.md`, `TESTING.md`
6. Configure CI gates (typecheck, lint, Lighthouse CI, axe-core)

## Acceptance Criteria
- Build and dev server run locally with documented steps.
- Page renders with RSC-first layout and placeholder sections.
- Content read exclusively from `/content/site.ts`.
- CI passes on Preview; baseline Lighthouse ≥90, axe: no criticals.

## References
- PRD §§4,5,6,7,8
- Architecture §§2.1, 2.7, 4.3
