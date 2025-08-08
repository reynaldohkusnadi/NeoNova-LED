# EPIC-002 — Content & Core Components (RSC)

Status: Approved
Owner: Product Owner (Sarah), Frontend Lead
Timeline: Sprint 1–2

## Goal
Implement the core RSC-first sections and wire them to the typed content model with strict a11y and performance guardrails.

## Outcomes
- NavbarMinimal, CardCarousel (RSC wrapper), Proven Impact (aux), Results Band (RSC wrapper) scaffolds.
- All copy sourced from `/content/site.ts` (PRD §5.3).
- Accessibility defaults (focus-visible, semantics) applied.

## Scope
- Implement RSC shells for sections: Navbar, Carousel wrapper, Proven Impact, Results Band.
- Wire analytics placeholders per PRD §6.7 (no heavy logic yet).
- Ensure keyboard reachability and visible focus styles across components.

## Out of Scope
- GSAP timelines and WebGL hero (EPIC-003).
- SlideOverForm and Server Action (EPIC-004).

## Dependencies
- EPIC-001 (foundation & content model)
- PRD §§5,6,7; Architecture §2.1–2.3, 2.6

## Risks
- Component scope creep; lock to content + a11y wiring only in this epic.

## Story Outline
1. NavbarMinimal (RSC) wired to `content.form` CTAs
2. Carousel wrapper renders 3 cards from `content.cardsCore`
3. Proven Impact aux slot logic (`cardsAux[0]` optional)
4. Results Band RSC shell hooked to 2 stats
5. A11y pass (keyboard reachability, focus rings, semantics)

## Acceptance Criteria
- All sections render from `content/site.ts`; no hardcoded copy.
- Keyboard navigation path verified; focus-visible styles present.
- No Client-side animation logic introduced yet.

## References
- PRD §§5–6, 7.2
- Architecture §§2.1–2.3
