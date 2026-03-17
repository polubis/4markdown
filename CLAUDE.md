# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run develop        # Start Gatsby dev server
npm run build          # Clean + production build
npm run lint           # Run Biome linter
npm run lint:fix       # Fix linting issues
npm run format         # Format code with Biome
npm run typecheck      # TypeScript type check (no emit)
npm run test           # Run Jest unit tests once
npm run test:watch     # Run Jest in watch mode
npm run e2e:open       # Open Cypress UI
npm run e2e:all        # Run all Cypress E2E tests
```

Node: `22.17.0`, npm: `10.9.2`. Install with `npm i --legacy-peer-deps`.

Requires `.env.development` with Firebase credentials (`GATSBY_API_URL`, `GATSBY_API_KEY`, `GATSBY_AUTH_DOMAIN`, `GATSBY_PROJECT_ID`, `GATSBY_STORAGE_BUCKET`, `GATSBY_MESSAGING_SENDER_ID`, `GATSBY_APP_ID`, `GATSBY_MEASUREMENT_ID`).

## Architecture

**Stack:** Gatsby 5 (SSG) + React 18 + TypeScript (strict) + Firebase backend (Cloud Functions, Auth, Storage) + Zustand state + Tailwind CSS + Biome linter.

**Branching:** `develop` is the default branch; `main` is production-only.

### Directory Map

| Path | Purpose |
|------|---------|
| `src/pages/` | Gatsby file-based routing |
| `src/features/` | Domain-driven feature directories (auth, creator, mindmap-creator, etc.) |
| `src/modules/` | Feature-specific UI modules with local state |
| `src/containers/` | Smart components that wire state to UI |
| `src/components/` | Stateless, reusable UI pieces |
| `src/design-system/` | Base UI components and design tokens |
| `src/store/` | Zustand stores, one folder per feature |
| `src/acts/` | Async multi-step operations that span multiple stores |
| `src/api-4markdown/` | Firebase API client |
| `src/api-4markdown-contracts/` | Typed API contracts and DTOs |
| `src/core/` | Auth utilities, analytics, shared models |
| `src/development-kit/` | Form utilities, Zustand wrapper (`state.ts`), helper functions |
| `src/models/` | Shared data model types |
| `src/providers/` | React context providers |
| `src/layouts/` | Page layout components |

### State Management Pattern (from DS.md)

Every store feature lives under `src/store/[feature-name]/` with four files:

```
index.ts      # Creates and exports the Zustand hook: useFeatureNameState
models.ts     # Defines the state shape: type FeatureNameState = ...
actions.ts    # Sync-only state mutation functions (postfix: Action)
selectors.ts  # Typed data extraction functions (postfix: Selector)
```

State is created via the custom wrapper in `development-kit/state.ts` which exposes `.swap()`, `.reset()`, and `.subscribe()`.

**Acts** (`src/acts/name.act.ts`) orchestrate multi-step async flows that span multiple stores or require API calls + side effects. Use the `Act` postfix.

### TypeScript Path Aliases

Configured in `tsconfig.json` — use these instead of relative paths:

`design-system/*`, `development-kit/*`, `store/*`, `features/*`, `modules/*`, `components/*`, `models/*`, `providers/*`, `core/*`, `layouts/*`, `acts/*`, `containers/*`, `api-4markdown`, `api-4markdown-contracts`

### Conventions (from DS.md)

- All exports go at the **bottom** of the file.
- State type names use the `State` postfix (e.g., `UploadImageState`).
- Action functions use the `Action` postfix; selectors use the `Selector` postfix.
- Actions are always synchronous and free of side effects.
- Acts always declare an explicit return type and use `AsyncResult<T>` from `development-kit/utility-types`.
- Local single-use component props can be inlined without a named type: `({ content }: { content: string })`.

### API Layer

API calls go through `getAPI().call('methodName')(params)` from `api-4markdown`. Errors are parsed via `parseError()`. The `api-4markdown-contracts` package defines all method contracts and DTOs.

### Graph/Mindmap

`@xyflow/react` handles diagram rendering; `@dagrejs/dagre` provides the layout engine. Key features: `mindmap-creator`, `mindmap-preview`, `mindmap-display`.
