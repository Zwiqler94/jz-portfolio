# Copilot Instructions

## Overview

This monorepo is a portfolio application that demonstrates Jake’s Angular + Node/Firebase stack in a real, installable PWA.

- **Purpose:** showcase production-grade patterns through interactive demos, playful endpoints, and data visualizations. Primary audience: hiring managers, collaborators, and clients.
- **Architecture:** Angular 20 frontend (PWA) + Firebase Functions backend (TypeScript/Express) + PostgreSQL for durable data and sample datasets.
- **User experience:** fast first load, accessible UI, offline support, install prompt, background sync, and reliable fallbacks when the network or backend is unavailable.
- **Code quality:** strict typing, standalone components, signals, native control flow, typed reactive forms, and clean DI with `inject()`.

**Dependencies**

- **Everything Lib** (`@zwiqler94/everything-lib`): a set of Angular components and utilities that drive multiple demo endpoints to showcase patterns and skills.
- **Username Generator (backend):** exposed via Firebase Functions and surfaced through Everything Lib.
- All libraries are consumed as npm packages.

## Version targets and policy

- Angular: 20.x
- Node: Active LTS for CI and local dev
- Firebase Functions: 2nd gen
- Policy: match all code examples, APIs, and best practices to these versions. If a sample conflicts with the target, prefer the official docs for this version.

---

## Frontend (`src/`)

Standard Angular app.

- **Build and serve**
  Local: `npm run build:local` and `npm run start:local`. Build options live in `angular.json`.

- **Structure**
  Components in `src/app/components`
  Services in `src/app/services`
  Global styles in `src/styles.scss`
  Theme variables in `src/style_vars`
  Environments in `src/environments`

### Angular 20 patterns

- **Strict TypeScript**
  `strict: true`. Prefer inference when obvious. Avoid `any`. Use `unknown` then narrow.

- **Standalone by default**
  Use standalone components, directives, and pipes. Do not add NgModules. Do not set `standalone: true` unless overriding edge cases.

- **Signals**
  Local UI state with `signal`. Derived state with `computed`. Update with `.set` and `.update` only. Do not use `mutate`.

- **Routing**
  Lazy load all feature areas. Keep route data and guards small and pure.

- **Host bindings**
  Use the `host` metadata object for attributes, classes, styles, and events. Avoid `@HostBinding` and `@HostListener` except for legacy interop.

- **Inputs and outputs**
  Use the `input()` and `output()` initializer APIs, not decorators.

- **Change detection**
  `changeDetection: ChangeDetectionStrategy.OnPush` on all components.

- **Templates**
  Use native control flow `@if`, `@for`, `@switch`. Keep logic minimal. Use `async` pipe for Observables.
  Pitfall: do not use `as` aliasing in `@else if`.

- **Forms**
  Prefer Reactive and typed forms. No template-driven forms.

- **Styling**
  Use SCSS. Keep component styles co-located. Prefer class and style bindings over `ngClass` and `ngStyle`.

- **Images**
  Use `NgOptimizedImage` for static assets. Avoid inline base64.

- **DI**
  Use `inject()` in components, directives, and services. Singletons with `providedIn: 'root'`.

- **Zoneless optional**
  If running zoneless, remove ZoneJS from polyfills and tests, and configure change detection accordingly.

### PWA requirements

- **Manifest**
  Provide app name, short name, theme color, icons at multiple sizes, and display mode. Keep scope and start_url accurate.

- **Service worker**
  Cache app shell and critical assets. Cache API responses with sensible TTLs. Provide an offline fallback route. Avoid caching POST bodies or PII.

- **Installability**
  Ensure HTTPS, valid manifest, served service worker, and no blocking permission prompts on first load.

- **Accessibility and performance**
  Meet common a11y checks. Enforce performance budgets for JS, images, and fonts. Defer noncritical work to idle or background.

### CSS and web platform

- **Baseline-friendly**
  Prefer features widely available in current Baseline. If using newer features, gate behind `@supports` and provide fallbacks.

- **Layout and responsiveness**
  Use flex and grid with minmax patterns. Prefer logical properties for directionality. Respect `prefers-reduced-motion`.

- **Maintainability**
  Keep selectors shallow. Use utility classes for spacing and layout. Co-locate small component styles. Centralize design tokens.

---

## Backend (`functions/`)

Firebase Functions v2 with Express.

- **Structure**
  `controllers`, `middleware`, `models`, `routes`

- **Local dev**
  Emulator: `npm run serve --prefix functions`

- **Database**
  PostgreSQL access and data mappers in `functions/src/`

- **Auth and identity**
  Expect an ID token on authenticated endpoints. Verify ID tokens with the Admin SDK and derive `uid` for authorization decisions.

- **App Check**
  For protected endpoints, require and verify App Check tokens. Provide an Express middleware that validates the `X-Firebase-AppCheck` header and rejects unauthorized requests.

- **Secrets**
  Store secrets in Secret Manager. Declare required secrets in each function’s `secrets` option. Only functions that list a secret can read it. Redeploy when rotating.

- **CORS**
  Default deny. Allow only required origins and methods. Reject wildcard credentials.

- **Logging**
  Log with context. Do not log secrets, tokens, or PII. Include request IDs where available.

---

## Security and privacy checklist

- Validate inputs at API boundaries.
- Authorize by role or resource ownership on every write and sensitive read.
- Never trust client-provided roles or flags.
- Keep secrets in Secret Manager only.
- Respect App Check and Auth on all protected endpoints.
- Sanitize outputs that cross trust boundaries.
- Apply least privilege for service accounts and database users.

---

## General workflows

- **Testing**
  Frontend: `ng test`.
  Backend: unit tests for middleware and controllers.
  Write a test for a bug before the fix.

- **Linting**
  `ng lint` and TypeScript checks must pass before merge.

- **Commits**
  Conventional Commits.

- **Dependencies**
  Run `npm install` at repo root and in `functions/`.

---

## Key files

- `angular.json` workspace build and serve config
- `package.json` scripts
- `firebase.json` hosting and functions config
- `functions/src/app.ts` Express app
- `functions/src/index.ts` Functions entry point

---

## Agent rules of engagement

- Prefer official docs that match the versions in this file.
- Generate Angular code using standalone components, signals, native control flow, `input()` and `output()`.
- Do not introduce NgModules, legacy `*ngIf/*ngFor`, or `@HostBinding/@HostListener`.
- For backend samples, show Express middleware for ID token and App Check verification.
- Show PWA code that includes a valid manifest and service worker registration.
- Use Baseline-safe web features by default, with progressive enhancement for newer APIs.

---

## References

Authoritative links for agents:

- Angular
  https://angular.dev/llms.txt
  https://angular.dev/guide/signals
  https://angular.dev/guide/templates/control-flow
  https://angular.dev/guide/di
  https://angular.dev/guide/image-optimization
  https://angular.dev/guide/forms

- Web platform and CSS
  MDN PWA overview: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
  web.dev Learn: https://web.dev/learn/
  Baseline overview: https://web.dev/how-to-use-baseline/

- Firebase
  Functions environment and secrets: https://firebase.google.com/docs/functions/config-env
  Verify ID tokens: https://firebase.google.com/docs/auth/admin/verify-id-tokens
  App Check overview: https://firebase.google.com/docs/app-check
