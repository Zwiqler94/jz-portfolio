This is a full-stack monorepo containing an Angular frontend and a Firebase Functions backend.

### Frontend (`src/`)

The frontend is a standard Angular application.

-   **Build & Serve:** Use the provided npm scripts for different environments. For local development, use `npm run build:local` and `npm run start:local`. The `angular.json` file contains all build configurations.
-   **Components:** Components are located in `src/app/components`.
-   **Services:** Services are in `src/app/services`.
-   **Styling:** Global styles are in `src/styles.scss`. Component-specific styles are co-located with the components. The project uses SCSS and has a theme system in `src/style_vars`.
-   **Environments:** Configuration for different environments (local, dev, prod) is managed in the `src/environments` directory.


#### TypeScript & Angular Best Practices

- Use strict type checking throughout the codebase. Prefer type inference when the type is obvious. Avoid the `any` type; use `unknown` if the type is uncertain.
- Always use standalone components (do not set `standalone: true` in decorators; it's the default). Avoid NgModules.
- Use signals for state management and `computed()` for derived state. Do NOT use `mutate` on signals; use `update` or `set` instead.
- Implement lazy loading for feature routes.
- Do NOT use `@HostBinding` or `@HostListener` decorators; instead, use the `host` object in the `@Component`/`@Directive` decorator.
- Use `NgOptimizedImage` for all static images (not for inline base64 images).
- Keep components small, focused, and single-responsibility. Prefer inline templates for small components.
- Use `input()` and `output()` functions instead of decorators for component communication.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in all components.
- Prefer Reactive forms over Template-driven forms.
- Do NOT use `ngClass` or `ngStyle`; use `class` and `style` bindings instead.
- Keep templates simple and avoid complex logic. Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
- Use the async pipe to handle observables in templates.
- Design services around a single responsibility. Use `providedIn: 'root'` for singletons. Use the `inject()` function instead of constructor injection.
- For state, keep transformations pure and predictable.
- Common pitfall: You cannot use `as` expressions in `@else if (...)` (e.g., `@else if (bla(); as x)` is invalid).

### Backend (`functions/`)

The backend is a set of Firebase Functions written in TypeScript, using Express.js.

-   **Structure:** The code is organized into `controllers`, `middleware`, `models`, and `routes`.
-   **Local Development:** To run the backend locally, use `npm run serve --prefix functions`. This will start the Firebase emulator.
-   **Database:** The backend connects to a PostgreSQL database. Database-related code, including models and controllers, can be found in the `functions/src/` directory.
-   **Authentication & Authorization:** Firebase Authentication is used. App Check is enforced via middleware (`functions/src/middleware/auth.middleware.ts`).
-   **Secrets:** Secrets are managed using Firebase's secret management. See `functions/src/secret-config.ts`.

### General Workflows

-   **Testing:** Run `ng test` for frontend unit tests.
-   **Linting:** Run `ng lint` to check for code quality issues.
-   **Commits:** This project uses [Conventional Commits](https://www.conventionalcommits.org/). Please follow this standard for your commit messages.
-   **Dependencies:** Use `npm install` to install dependencies for both the root project and the `functions` directory.

### Key Files

-   `angular.json`: Defines all the build and serve configurations for the Angular app.
-   `package.json`: Contains all the scripts for building, serving, testing, and linting.
-   `firebase.json`: Configuration for Firebase hosting and functions.
-   `functions/src/app.ts`: The main Express application for the backend.
-   `functions/src/index.ts`: The entry point for the Firebase Functions.

### References

For quick, authoritative examples and API details, consult Angular's LLM-friendly index:

- https://angular.dev/llms.txt  — a compact table-of-contents for the Angular docs.

Recommended sections for this repository (use these when the instruction requires concrete API usage or examples):

- Signals & reactivity: `guide/signals` (use `signal`, `computed`, `resource`, avoid `mutate`, prefer `update`/`set`).
- Dependency injection: `guide/di` (use `inject()`; understand provider scopes and `providedIn`).
- Templates & control flow: `guide/templates` (expression syntax, `@if/@for/@switch` patterns used in this repo).
- Image optimization: `guide/image-optimization` (prefer `NgOptimizedImage` for static assets).
- Forms: `guide/forms` and `guide/forms/typed-forms` (prefer Reactive/typed forms for strict typing).
- Testing & debugging: `guide/testing` (component harnesses, service testing, and test debugging tips).

AI agents: prefer the above links when generating code snippets or looking up exact option names and signatures. Cite the Angular docs when necessary.
