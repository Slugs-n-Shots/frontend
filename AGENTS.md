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

## Verification

Prefer narrow verification first:

- npm run test, if available
- npm run lint, if available
- npm run build, before larger frontend changes

If checks cannot be run, explain why and provide manual verification steps.
