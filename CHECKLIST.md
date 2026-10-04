# dd-project — Issues Checklist

Tracks known gaps and follow-up work identified during a codebase review.
Check an item off when the fix is merged and verified.

## Functional gaps

- [x] **Add Supabase schema to the repo.** No `.sql`/migration exists for table
      `debugging_diary` or RPC `search_diary`, yet `src/services/diary.js` depends
      on both. Added `supabase/schema.sql` with the table, index, RLS policies and
      the `search_diary` RPC (matches title or tag). Server-side search restored.
- [x] **Add `.env.example`.** Document `VITE_SUPABASE_URL` and
      `VITE_SUPABASE_ANON_KEY`; the real `.env` is gitignored.
- [x] **Style the actual UI.** `src/styles/main.css` has no selectors for
      `#entries`, `.entry`, `.actions`, `#diary-form`, `#search-input` or
      `fieldset` — the diary is effectively unstyled.
- [x] **Fix UTC date bug.** `todayTag()` in `src/utils/date.js` uses
      `toISOString()`, so the `[dd-YYYY-MM-DD]` tag can be off by one day
      depending on the user's timezone. Use local date parts instead.

## Dead code / scaffold leftovers

- [x] Remove or implement `src/components/SearchBar.js` (empty, imported nowhere;
      search logic actually lives in `src/main.js`).
- [x] Remove unused `src/counter.js`.
- [x] Remove unused assets: `src/assets/hero.png`, `src/assets/javascript.svg`,
      `src/assets/vite.svg`.
- [x] Remove unused Vite scaffold CSS (`.counter`, `.hero`, `#app`, `#center`,
      `#next-steps`, `#docs`, `#spacer`, `.ticks`) from `src/styles/main.css`.
- [x] Link a favicon in `index.html` (files exist in `public/` but are never
      referenced).

## Process gaps vs. AGENTS.md

- [x] Add the tooling `AGENTS.md` assumes: `npm run lint`, `npm run format:check`,
      `npm test`. Uses ESLint (flat config) + Prettier + `node:test`.
- [x] Create the `src/server/`, `src/shared/` and `test/` folders described by
      `AGENTS.md`, or update `AGENTS.md` to match the actual structure. Updated
      `AGENTS.md` instead: the app is client-only, so `server`/`shared` do not
      apply; only `test/` was created.
- [x] Add `vite.config.js` to make env/build configuration explicit.

## Notes

- No UI framework (Bootstrap/Tailwind) is used or referenced anywhere — there is
  no missing framework reference. If a framework is desired, it must be added as
  a new dependency.
- An on-page "Console Output" panel (`#console-output`) logs load/save/delete/
  search activity and errors instead of failing silently.
