Neo Nova Website — Next.js App Router foundation.

## Getting Started

Prerequisites: Node 20+, pnpm via Corepack.

```bash
corepack enable pnpm
pnpm install
pnpm dev
```

Open http://localhost:3000.

Project structure:

- `app/` App Router RSC-first structure
- `content/site.ts` Typed content model (single source of truth)
- `app/(sections)/*` Placeholder components for Hero3D, Carousel, ResultsBand, Form
- `lib/` Stubs for analytics and motion/a11y hooks
- `styles/tokens.css` Base tokens

## Analytics

- Events are dispatched via `lib/analytics/track.ts` (stubbed).
- Wire to Vercel Analytics or a custom endpoint in later stories.

## References

- Architecture: `docs/architecture/` and `docs/epics/`
- PRD: `docs/prd/`

## Validations

```bash
pnpm typecheck
pnpm lint
pnpm build
```

CI also runs Lighthouse CI and axe checks. See `.github/workflows/ci.yml`.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

Use Vercel project with protected `main`, Preview per PR. Domains and HSTS are covered in Story 6.1.
