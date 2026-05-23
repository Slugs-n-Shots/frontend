# Frontend AGENTS.md

## Frontend context

This folder contains the React frontend application.

Common stack:
- React
- JavaScript
- Vite
- npm

## React working rules

- Use JavaScript for new React code.
- Prefer functional components and hooks.
- Keep components small and focused.
- Preserve existing component structure and styling approach.
- Avoid broad UI refactors unless explicitly requested.
- Avoid changing UI copy unless the task requires it.
- Do not introduce global state unless needed.
- Do not introduce new packages unless explicitly requested or clearly justified.

## API integration

When changing frontend API calls:
- preserve existing error handling patterns
- preserve loading and empty states
- check whether backend response shape is documented or tested
- avoid silently changing request payload fields

## Frontend commands

Use npm from the `frontend/` directory.

- Start dev server: `npm run dev`
- Run all frontend tests: `npm run test`
- Run a specific Vitest test file: `npm run test -- path/to/file.test.jsx`
- Run the production build: `npm run build`

Do not add or document lint, formatter, or typecheck commands unless the corresponding package scripts and configuration exist in this project.

## Docker workflow

When running frontend npm commands from the repo root, prefer the Docker node service:

- Run a specific frontend test: `docker compose exec -T node npm run test -- src/path/file.test.jsx`
- Run all frontend tests: `docker compose exec -T node npm run test`
- Run the frontend build: `docker compose exec -T node npm run build`

Use direct `npm` commands only when working inside the `frontend/` directory with a working local Node/npm environment.

## Verification

- Prefer the narrowest useful verification first. Test updated behavior when tests exist.
- Prefer targeted tests for the files or behavior changed. Use project-wide build sparingly, but run it before larger frontend changes, dependency changes, routing changes, or when explicitly requested.
- If checks cannot be run, explain why and provide manual verification steps.
- In unit tests, do not assert exact Vite asset URLs for `?url` imports. Prefer behavior checks or explicit data attributes.

## Styling

- Use the existing Bootstrap/react-bootstrap patterns for Bootstrap-based screens.
- Treat `public/assets/css` files as static legacy assets, not npm-managed source.
- Public pages should use Bootstrap CSS from the installed npm package, not `public/assets/css/pub.css` or a copied `public/assets/css/bootstrap.min.css`.
- The admin layout uses the Start Bootstrap SB Admin theme; treat `public/assets/css/adm.css` and `public/assets/css/sbAdmin.css` as static theme assets.
- Prefer npm package imports for new Bootstrap setup work when practical.
- Keep app-specific Bootstrap overrides separate from vendor CSS and loaded after Bootstrap.
- Public and admin layouts may attach layout-specific stylesheets in their layout component. Keep cleanup logic in the same `useEffect`.
- Mark dynamically attached layout stylesheets with `data-layout-style` so tests and cleanup can identify them.
- Do not replace Bootstrap/react-bootstrap with another UI system unless explicitly requested.
