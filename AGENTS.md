# AGENTS.md

These instructions apply to the full `jz-portfolio` repository unless a more
specific `AGENTS.md` is added in a subdirectory.

## Repo Shape

- Angular 20 portfolio/PWA frontend in `src/`.
- Firebase Functions v2 backend in `functions/`, using TypeScript, Express, and
  PostgreSQL.
- Firebase hosting/deploy wiring in `firebase.json` and `.github/workflows/`.
- Global project background lives in `.instructions.md`; this file is the
  operational checklist for agents working in this repo.

## Prime Directives

- Make surgical, minimal diffs in the right ownership layer.
- Do not commit, push, rewrite history, or run destructive commands unless the
  user explicitly asks.
- Treat the current working tree as user-owned. If unexpected changes affect the
  task, pause and ask before touching them.
- Prefer existing Angular/Firebase patterns already in the repo. Do not add new
  dependencies unless the user asks or the existing stack cannot solve the
  problem safely.
- If a local fix becomes workaround-heavy, re-check whether the bug belongs in a
  shared service, backend route, middleware, or build configuration.

## Security Tripwires

- Never print, copy, or persist secret values. If a secret is present, report only
  the file and line, then recommend rotation.
- Treat these as secret-sensitive surfaces:
  - `pg-test.js`
  - `sonar-project.properties`
  - `functions/credentials.json`
  - `src/environments/*`
  - `.npmrc`, `.env*`, Firebase service-account files
- Do not add credentials, tokens, connection strings, API secrets, or private keys
  to tracked files. Use Firebase Secret Manager, CI secrets, or local ignored env
  files.
- App Check is abuse protection, not user authorization. Any backend write or
  sensitive read must verify Firebase Auth ID tokens and make an admin/ownership
  decision server-side.
- UI checks such as `isUserAdmin()` are display logic only. They must never be the
  only protection for admin actions.
- Secret values should not be exposed through client-callable routes. Functions
  should read server-only secrets and perform the privileged operation directly.
- Dynamic HTML from posts, previews, editors, or the database is untrusted.
  Avoid `bypassSecurityTrustHtml`; if rich HTML must render, sanitize it with an
  explicit allowlist and add a regression test for script/event-handler payloads.
- Use parameterized SQL for all request-derived values. Do not string-interpolate
  request bodies into SQL.
- Do not log tokens, secrets, connection strings, raw credentials, or full rich
  content payloads.

## Frontend Guidance

- Use standalone Angular components. Do not introduce NgModules.
- Prefer signals (`signal`, `computed`, `input`, `output`, `model`) for local UI
  state and component contracts.
- Use native template control flow (`@if`, `@for`, `@switch`).
- Prefer `inject()` for DI.
- Keep component styles co-located and use shared SCSS tokens from
  `src/style_vars` when a token already exists.
- If touching layout, check both desktop and mobile behavior. Watch especially
  for dynamic viewport units making controls/images too small on narrow screens.
- If adding timers, subscriptions, DOM listeners, animations, or observers, add
  teardown via `DestroyRef`, `takeUntilDestroyed`, or `ngOnDestroy`.
- Do not use `detectChanges()`, `markForCheck()`, `setTimeout()`, or duplicate
  state guards as a first response to change-detection issues. First check data
  flow and ownership.

## Known Drift / Do Not Copy

- Some existing rich post rendering uses trusted HTML. Treat this as security
  debt, not as permission to expand `[innerHTML]` or sanitizer bypass surfaces.
  When touching rich post rendering, prefer a sanitizer allowlist and add a
  regression test for script/event-handler payloads.
- Some existing components use manual subscriptions, `detectChanges()`, broad
  `any`, or workaround-style state guards. Do not copy these patterns into new
  code; use them only when preserving existing behavior in a focused change.
- `npm run build:local` depends on `src/environments/environment.local.ts`.
  Verify that file exists locally or use the `dev-local` path before assuming a
  clean checkout can run the local build.
- Backend feed/query logic has repeated route-specific paths. If changing one
  feed path, check related generic and older feed-specific paths before adding
  another duplicate branch.
- There is no explicit repo-level `.prettierrc`; use Prettier defaults plus
  `.editorconfig` and do not introduce a new formatting config unless requested.

## Backend Guidance

- Routes live under `functions/src/routes`; ownership logic belongs in middleware
  or controllers, not in the Angular caller.
- Add Auth and authorization checks to backend write/sensitive-read routes before
  trusting frontend state.
- Keep App Check verification as a separate middleware concern from user Auth.
- Validate all request bodies with route validators before controller work.
- Ensure database clients are released on every path. Prefer one clear acquire /
  query / release lifecycle per request.
- Avoid duplicating feed-specific query logic. If changing one feed path, check
  the generic feed route and the older feed-specific routes for drift.
- Keep error responses useful but not secret-bearing. Avoid returning raw error
  objects or stack traces to clients in production paths.

## Local Package Coupling

- `ngx-gallery-jz` may be consumed from a sibling local build:

  ```json
  "ngx-gallery-jz": "file:../ngx-gallery-jz/dist/ngx-gallery-jz"
  ```

- Before changing gallery usage or CI/deploy behavior, verify whether the sibling
  library exists and is built locally. For CI, either use a published package or
  explicitly check out/build the sibling library.
- Do not assume a clean GitHub runner has `../ngx-gallery-jz`.

## Validation

Run the smallest relevant checks first, then broaden when touching shared code.

Frontend:

```bash
npx tsc -p tsconfig.app.json --noEmit --pretty false
npx tsc -p tsconfig.spec.json --noEmit --pretty false
npm run lint
npm test -- --watch=false --browsers=ChromeHeadless
```

Backend:

```bash
npm --prefix functions run build
npm --prefix functions run lint
```

Production/build-sensitive changes:

```bash
npm run build:prod
```

If ChromeHeadless is unavailable, omit the `--browsers` flag. If a command is
blocked by environment/tooling, capture the exact error and provide a targeted
manual validation matrix.

## Review Checklist

When asked to review the repo, include at least:

- Secrets and tracked credential exposure.
- Backend authorization vs frontend-only admin gating.
- App Check placement and whether it is being mistaken for Auth.
- Dynamic HTML rendering and sanitizer bypasses.
- Long-lived subscriptions, timers, polling, and animation teardown.
- Build/CI reproducibility, especially local `file:` dependencies.
- Frontend and functions validation status.

Lead review responses with findings ordered by severity and include file/line
references. Summaries and style notes come after behavioral/security issues.

## Output Expectations

For code changes, report:

- What changed.
- Where.
- Validation run and results.
- Real risks or follow-ups.

For security findings, do not quote secret values. Refer to paths and line
numbers only.
