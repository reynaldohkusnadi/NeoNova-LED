# EPIC-003 — Motion & 3D Hero

Status: Approved
Owner: Motion/FE Lead
Timeline: Sprint 2

## Goal
Introduce GSAP + ScrollTrigger motion patterns and a lightweight WebGL hero with strict budgets and fallbacks.

## Outcomes
- `usePrefersReducedMotion` and `useGsapScrollTrigger` hooks implemented.
- Hero3D client component with feature detection and static fallback.
- Motion guardrails: no long tasks > 50ms; reduced motion parity.

## Scope
- Implement hooks and register/destroy timelines safely.
- Implement `Hero3D` with payload ≤ 1.2 MB and fallback image.
- Add motion to Carousel/ResultsBand wrappers without regressions.

## Out of Scope
- Form logic and server action (EPIC-004).

## Dependencies
- EPIC-001 (foundation), EPIC-002 (RSC shells)
- PRD §§3.2, 6.8; Architecture §§2.4–2.6, 2.7

## Risks
- WebGL variability on mobile Safari; mitigate with robust feature detect and static fallback.

## Story Outline
1. Implement `usePrefersReducedMotion` and `useGsapScrollTrigger`
2. Build `Hero3D` with fallback `StaticHero` and payload audit
3. Add minimal GSAP reveals to Carousel and Results Band
4. Validate performance budgets and a11y under reduced motion

## Acceptance Criteria
- 3D payload ≤ 1.2 MB; fallback path verified.
- No animation tick > 50ms; timelines cleaned on unmount.
- Reduced motion disables pin/scrub everywhere.

## References
- PRD §§3.2, 6.8, 7.1–7.5
- Architecture §§2.4–2.7
