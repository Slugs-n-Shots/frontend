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

## Risk tiers

Classify each frontend change before implementation:

- Tier 0: documentation, comments, non-executable metadata, tiny visual-only changes.
- Tier 1: normal UI or feature work without auth, payment, privacy, persistence, or cross-route state impact.
- Tier 2: auth, authorization, API contracts, user/profile data, GDPR, payments, receipts, table sessions, order state, staff/admin workflows, or shared context changes.
- Tier 3: irreversible destructive flows, security-sensitive primitives, or high-blast-radius changes.

If unsure between two tiers, choose the higher tier.

For Tier 2/3 changes, state assumptions, affected files, test plan, rollback plan, and residual risk before or during implementation.

## High-risk frontend areas

Treat these as Tier 2 by default:

- login, logout, token refresh, realm switching
- profile, GDPR export/anonymization, profile picture upload/delete
- registration compliance fields such as `is_over_18`
- order submission and order status changes
- table sessions, table membership, spending limits, and table closing
- payments, receipts, payer/accounting data, and mark-paid workflows
- staff/admin workflows that affect guest, order, payment, or table state

For these areas, preserve backend response semantics and add focused tests around success, failure, and conflict states.

## API integration

When changing frontend API calls:
- keep endpoint changes explicit and easy to review
- prefer endpoint constants for new backend URLs
- preserve existing error handling patterns
- preserve loading and empty states
- check whether backend response shape is documented or tested
- handle `401`, `403`, `409`, and validation errors deliberately
- avoid silently changing request payload fields
- do not clear local state after failed order/payment calls unless explicitly required
- do not log tokens, personal data, payment data, payer data, or full export payloads

## Dependencies

Default to no new dependencies.

Before adding a dependency, document:
- problem solved
- why existing packages or local code are insufficient
- maintenance/security posture
- bundle/runtime cost
- rollback or removal path

Avoid adding overlapping libraries for UI, state, dates, forms, charts, or API clients.

## Assumptions and pushback

Do not invent backend behavior.

If an API contract is unclear, document the assumption and prefer a small adapter or UI state that can be changed safely later.

Push back before implementing requirements that would weaken validation, authorization, privacy, payment correctness, or auditability.

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

## Testing discipline

For production behavior changes, prefer Red -> Green -> Refactor:

- Red: add or update a failing test that captures the intended behavior or regression.
- Green: implement the smallest change that makes the test pass.
- Refactor: improve structure only after tests are green.

Bug fixes should include a regression test whenever practical.

For Tier 2/3 changes, do not rely only on manual testing unless automated testing is blocked; document the blocker and manual verification steps.

## Change evidence

For meaningful changes, final responses should include:

- risk tier and rationale
- changed files
- behavior changed
- tests or build commands run
- known assumptions
- rollback notes for Tier 2/3 changes

Avoid vague evidence such as "tested" without the command and result.

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
