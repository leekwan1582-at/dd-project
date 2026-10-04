# dd-project — Problem-Solving Diary

A small single-page web app for recording debugging/problem-solving entries. Each
entry captures five fields — **Symptom**, **Tried**, **Root Cause**, **Fix** and
**Lesson** — tagged with a dated `[dd-YYYY-MM-DD]` label and title. Entries can be
created, edited, deleted, and searched by title or tag. Data is stored in
[Supabase](https://supabase.com/) and the client is built with [Vite](https://vite.dev/).

## Main entry points

- `index.html` — page shell: the entry form, search input and entries container.
  Loads `/src/main.js` as a module.
- `src/main.js` — application entry point: wires up the form, list rendering,
  edit/delete handlers and debounced search.

## Core folder structure

```
.
├── index.html                  # HTML shell + form markup
├── vite.config.js              # Vite dev/build config
├── eslint.config.js            # ESLint flat config
├── .prettierrc.json            # Prettier config (.prettierignore alongside)
├── .env.example                # Required env vars (copy to .env)
├── supabase/
│   └── schema.sql              # Table, index, RLS policies + search_diary RPC
├── public/                     # Static assets served as-is (favicon, icons)
├── src/
│   ├── main.js                 # App entry point / controller
│   ├── components/
│   │   ├── EntryForm.js        # Reads/submits the entry form, fill/reset helpers
│   │   └── EntryList.js        # Renders entries with edit/delete buttons
│   ├── services/
│   │   └── diary.js            # Supabase CRUD + search for the diary table
│   ├── lib/
│   │   └── supabaseClient.js   # Creates the shared Supabase client
│   ├── utils/
│   │   ├── date.js             # todayTag() and formatTimestamp()
│   │   └── escapeHtml.js       # HTML escaping for rendered content
│   └── styles/
│       └── main.css            # App styles
├── test/
│   └── date.test.js            # node:test unit tests for date utils
└── .docs/                      # Project notes (e.g. git setup)
```

## How it works

1. `src/main.js` imports the diary service and UI components.
2. `load()` fetches all entries via `getAllEntries()`, which are cached and drawn
   with `renderEntries()`.
3. Submitting the form calls `addEntry()` (or `updateEntry()` while editing).
4. Edit fills the form and sets `editingId`; Delete removes the entry and reloads.
5. Typing in the search box (debounced 250ms) calls `searchEntries()`, which
   invokes the Supabase RPC `search_diary`.
6. Errors and a short activity log are shown in the "Console Output" panel.

## Data layer

`src/services/diary.js` talks to the Supabase table `debugging_diary`:

| Function                   | Operation                              |
| -------------------------- | -------------------------------------- |
| `addEntry(entry)`          | Insert, returns the created row        |
| `getAllEntries()`          | Select all, newest first               |
| `updateEntry(id, updates)` | Update by id, returns the updated row  |
| `deleteEntry(id)`          | Delete by id                           |
| `searchEntries(query)`     | RPC `search_diary` with `{ q: query }` |

## Backend setup

Run `supabase/schema.sql` in the Supabase SQL editor (or `supabase db execute -f
supabase/schema.sql`). It creates the `debugging_diary` table, its index, the
`search_diary` RPC, and permissive row-level-security policies. The script is
idempotent. Note the policies grant unrestricted access to the anon key (no auth)
— see the warning in the file before using it with real data.

## Environment variables

Copy `.env.example` to `.env` in the project root and fill in your values:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both are read at build time in `src/lib/supabaseClient.js`. Never commit real keys.

## Commands

```bash
npm ci               # install dependencies
npm run dev          # start the Vite dev server
npm run build        # production build
npm run preview      # preview the production build
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run format:check # Prettier (check)
npm test             # node:test unit tests
```

The backend must be initialized with `supabase/schema.sql` (see above) for the
create/read/search features to work.
