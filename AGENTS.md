# AGENTS.md

## Project

- Problem-Solving Diary (`dd`): a client-only Vite single-page app for logging debugging/problem-solving entries (symptom, tried, root cause, fix, lesson) backed by Supabase.
- The repository, tests, `package.json` and linked docs are the source of truth. If this file disagrees with them, say so and follow the repository.

## Simplicity first

- Prefer the smallest correct implementation and minimal, focused diffs.
- Follow the patterns in nearby code. Reuse existing utilities and dependencies before adding new ones.
- Do not introduce packages, frameworks, classes, design patterns, wrapper layers, helper modules or configuration unless the task cannot be completed correctly without them.
- Do not refactor, rename, reformat or reorganize unrelated code.
- Prefer direct, readable JavaScript over clever or overly generic solutions.
- Avoid premature abstraction: duplicating a few simple lines is better than a speculative reusable abstraction.
- Keep existing APIs and persisted data formats stable unless the task explicitly requires a breaking change.

## Runtime and toolchain

- Node.js: current LTS, pinned in `engines` (`>=20.19.0`). Browsers: last 2 versions of evergreen browsers (or the project's `browserslist`).
- Package manager: npm only. Never use yarn or pnpm; never create another lockfile.
- ES modules everywhere: `"type": "module"` in `package.json`.
  - Relative imports need the full file extension (`./foo.js`); no directory imports.
  - No `require`, `module.exports`, `__dirname` or `__filename`. Use `import.meta.url` (or `import.meta.dirname` if the Node version supports it).
  - Config files that must be CommonJS use `.cjs`.
  - Do not add `"use strict";` (modules are strict already).
- Bundler for client code: Vite.
- Style: ESLint (flat config in `eslint.config.js`) and Prettier (`.prettierrc.json`, `.prettierignore`).

## Repository map

- `index.html`: HTML shell and form markup. `src/main.js`: app entry point / controller.
- `src/components/`: browser DOM components (`EntryForm`, `EntryList`). May use DOM APIs.
- `src/services/`: data access (`diary.js`, Supabase CRUD + search).
- `src/lib/`: shared clients (`supabaseClient.js`).
- `src/utils/`: pure helpers (`date.js`, `escapeHtml.js`).
- `src/styles/`: CSS.
- `test/`: `node:test` unit tests for pure/utility code. `dist/`, `coverage/`: generated; never edit by hand.
- `public/`: static assets served as-is. `supabase/`: SQL schema.
- There is no `src/server/`, `src/client/` or `src/shared/`: the app is entirely browser-side. All `src/` code runs in the browser; only `utils/` is kept free of DOM/Node APIs so it stays unit-testable.
- Dependency direction: `main` imports `components` and `services`; `components` and `services` import `lib` and `utils`; `utils` import nothing from the app.

## Commands

- Install: `npm ci`
- Format check: `npm run format:check`
- Lint: `npm run lint`
- Test: `npm test`
- Build: `npm run build`
- Adjust to the actual scripts in `package.json`.
- While working, run only the most relevant existing test or lint command for the files you changed. Before finishing, run every check your change affects.

## Workflow

- First inspect the relevant files and neighboring tests, then identify the smallest change.
- State the files you intend to change before editing. For non-trivial tasks, add a short plan.
- If requirements are ambiguous or conflict with existing project conventions, ask. Otherwise state your assumption and proceed.
- Add or update tests with every behavior change. Every bug fix gets a regression test.
- When finished, summarize changed files, behavior and verification.

## Conventions

- ESLint and Prettier configs are the source of truth for style; do not disable rules without a specific justification comment.
- `const` by default, `let` only for reassignment, never `var`. Strict equality (`===`), except deliberate `value == null`.
- Small single-purpose functions, guard clauses, descriptive names. Avoid hidden mutation, import-time side effects and circular dependencies.
- Export the smallest practical public surface.
- Validate data at boundaries (HTTP, CLI args, env vars, files, storage, `postMessage`, server responses). Return stable, documented shapes.

## Documentation and comments

- Add JSDoc to every function, class and module you create or substantially modify. Document parameters, return values, side effects, thrown errors and non-obvious assumptions.
- Explain _why_ when the reason is not evident from the code.
- Do not comment obvious code (trivial assignments, standard loops, self-explanatory names). Do not restate what the code says.
- Match the existing comment style of the file. Keep comments accurate; update or remove ones your change makes stale.

## Async and errors

- `async`/`await` for sequential flow; `Promise.all` only for independent work. Await or return every Promise; document any intentionally detached work and handle its rejection.
- Use `AbortSignal` and timeouts for external I/O.
- Catch errors only to recover, add context, translate at a boundary, or clean up. Rethrow unknown errors. When wrapping, keep the original as `cause`. Use stable `code` properties, not message text, for branching.

## Performance and memory

- Measure before optimizing. Do not rewrite working code for speed without evidence; for critical paths, suggest a benchmark (`performance.now()` or `node:perf_hooks`).
- For new algorithms and loops over collections, state time and space complexity, and annotate complex functions with `// Time: O(...), Space: O(...)`. Skip this for trivial changes.
- Avoid O(n²) or worse unless the problem requires it. Use `Set`/`Map` for lookups; prefer a single pass over nested loops on the same data.
- Provide cleanup for event listeners, timers/intervals, in-flight fetches (`AbortController`), subscriptions, observers, streams and file handles. Use `finally` or framework lifecycle hooks (e.g. a React `useEffect` cleanup, if React is used).
- Use `WeakMap`/`WeakSet` for caches keyed by objects. Bound every cache (size limit or LRU) if growth could be unbounded.
- Prefer module scope over globals. Avoid closures that retain large objects longer than needed.

## Testing

- Runner: `node:test` (`test/*.test.js`) for pure/utility code. No DOM/browser test environment is configured; do not add one without asking.
- Cover success, boundaries, invalid input and failure paths. Test observable behavior, not private internals.
- Keep tests deterministic: control time, randomness, network, filesystem and locale.

## Security

- Treat all external input as untrusted; validate with a schema or allowlist.
- Never commit, log or expose secrets. Anything shipped to the browser (code, source maps, build-time variables) is public: no secrets in client code.
- No `eval`, `new Function`, `innerHTML` or `document.write` with untrusted data. Use parameterized queries and safe process APIs (no shell string assembly).

## Dependencies

- Add a dependency only if the platform and existing packages can't reasonably do the job. State its purpose, size and maintenance status when adding it.
- Never hand-edit `package-lock.json`. Never run `npm audit fix --force`. After dependency changes run `npm audit --audit-level=high`.
- Do not add packages with install scripts, unexpected binaries or unclear ownership without human review.

## Boundaries

- Ask before: installing or removing packages, deleting files, changing CI or build configuration, running network-dependent commands.
- Do not commit, push, rewrite history or discard uncommitted changes unless asked.

## Definition of done

- Requested behavior works, with no unrelated changes.
- Format, lint, tests and build pass, and you actually ran them.
- Final message lists: what changed, commands run and their results, anything you could not run (with reason), and remaining risks. Never claim a check passed unless it completed successfully.
