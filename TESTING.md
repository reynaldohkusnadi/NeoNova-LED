# Testing

Local checks:

```
pnpm typecheck
pnpm lint
pnpm build
```

Preview checks (CI):

- Lighthouse CI (Perf ≥ 0.9)
- axe-core accessibility (no criticals)

See `.github/workflows/ci.yml`.

## Motion and Reduced Motion

- To validate reduced motion locally, enable “Reduce Motion” in OS settings and refresh. Hero reveals and section reveals will skip.
- To validate budgets locally:

```
pnpm ci:budgets
```

This prints first-load JS sizes and scans 3D assets directories; exit code 1 signals a budget failure.
