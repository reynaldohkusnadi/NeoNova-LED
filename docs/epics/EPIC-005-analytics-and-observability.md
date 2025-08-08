# EPIC-005 — Analytics & Observability

Status: Proposed
Owner: FE Lead
Timeline: Sprint 2

## Goal
Implement analytics wiring and basic observability to ensure reliable funnel metrics and operational insight.

## Outcomes
- `<Analytics />` mounted; `lib/analytics/track.ts` helper implemented.
- All events from PRD §6.7 emitted once with consistent payloads.
- Basic server logs on Server Action failures with latency.

## Scope
- Implement `track(event, payload)` with deduping.
- Wire events across components (hero, carousel, results, CTAs, form, WA deep link).
- Ensure no duplicate mounts; preview verifies events.

## Out of Scope
- Third-party trackers beyond Vercel Analytics.

## Dependencies
- EPIC-002 (components), EPIC-004 (form)
- PRD §6.7, §7; Architecture §2.9, §3.5

## Risks
- Over/under-counting; mitigate with central helper and preview validation.

## Story Outline
1. Implement `lib/analytics/track.ts` per Architecture §2.9
2. Wire events in components; add dedupe on visibility events
3. Add server logs for Server Action failure path
4. Validate event consistency in preview deploy

## Acceptance Criteria
- 100% events from PRD §6.7 present and accurate.
- No duplicates on mount/unmount cycles.
- Failure logs capture error class + elapsed ms.

## References
- PRD §6.7, §7.1–7.5
- Architecture §2.9, §3.5
