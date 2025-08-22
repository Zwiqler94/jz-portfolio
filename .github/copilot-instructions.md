This is a full-stack monorepo containing an Angular frontend and a Firebase Functions backend.

### Frontend (`src/`)

The frontend is a standard Angular application.

-   **Build & Serve:** Use the provided npm scripts for different environments. For local development, use `npm run build:local` and `npm run start:local`. The `angular.json` file contains all build configurations.
-   **Components:** Components are located in `src/app/components`.
-   **Services:** Services are in `src/app/services`.
-   **Styling:** Global styles are in `src/styles.scss`. Component-specific styles are co-located with the components. The project uses SCSS and has a theme system in `src/style_vars`.
-   **Environments:** Configuration for different environments (local, dev, prod) is managed in the `src/environments` directory.

#### Angular Best Practices
- Use standalone components.
- Use signals for state management.
- Use `NgOptimizedImage` for all static images.
- Keep components small and focused.
- Use `input()` and `output()` functions instead of decorators.
- Use `computed()` for derived state.
- Set `changeDetection: ChangeDetectionStrategy.OnPush`.
- Prefer Reactive forms.
- Use native control flow (`@if`, `@for`, `@switch`).
- Use the `inject()` function for services.

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
