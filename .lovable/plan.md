
# Migrate to plain React SPA (Vite + React Router) with portable backend adapter

Goal: hand off a 100% standard React project. No TanStack Start, no Supabase, no server functions. Backend team plugs in their REST API later by editing one file.

## What changes

### 1. Framework swap: TanStack Start → Vite + React + React Router

- Replace `@tanstack/react-start`, `@tanstack/react-router`, file-based routing, `routeTree.gen.ts`, `src/start.ts`, `src/router.tsx` with:
  - `react-router-dom` v6 (industry standard, what 90% of React teams know)
  - A single `src/App.tsx` declaring `<BrowserRouter>` + `<Routes>`
  - A standard `index.html` + `src/main.tsx` Vite entry
- Update `vite.config.ts` to remove TanStack plugins, keep React + Tailwind.
- Add `public/_redirects` (`/* /index.html 200`) so deep links work on any static host.

### 2. Remove all Lovable Cloud / Supabase code

Delete:
- `src/integrations/supabase/` (entire folder)
- `src/lib/artist.functions.ts` (server functions)
- `supabase/` folder (migrations, config)
- `.env` Supabase vars

### 3. Portable backend layer

New structure:
```
src/lib/api/
  types.ts           # Artist, Artwork TypeScript interfaces
  artist-api.ts      # ArtistAPI interface + active export
  mock-adapter.ts    # Returns hardcoded Priya Desai + 50 artworks
  rest-adapter.ts    # fetch(VITE_API_BASE_URL + '/artists/:slug') — ready, unused
```

`artist-api.ts` picks the adapter:
```ts
export const artistApi = import.meta.env.VITE_API_BASE_URL
  ? restAdapter
  : mockAdapter;
```

Team flips backends by setting one env var. No code edits needed.

### 4. Rewrite routes (no logic changes, no visual changes)

- `/` → home (current `src/routes/index.tsx` content moved to `src/pages/Home.tsx`)
- `/artist/:slug` → artist page (current `artist.$slug.tsx` content moved to `src/pages/Artist.tsx`)
- `/artist` redirects to `/artist/priya-desai`

Pages use `useEffect` + `useState` to call `artistApi.getArtistBySlug(slug)`. Loading/error states included.

### 5. API contract docs for the backend team

New file: `API-SPEC.md` at project root documenting:
- `GET /artists/:slug` → `Artist` JSON shape (with example)
- `GET /artists/:id/artworks` → `Artwork[]` JSON shape (with example)
- How to point the frontend at their API (`VITE_API_BASE_URL=https://...`)

## What stays identical

- All visual design, fonts, colors, layouts
- Public image assets in `public/`
- shadcn/ui components, Tailwind styles, `src/styles.css`
- The artist page content (Priya Desai bio, 50 artworks) — moved into `mock-adapter.ts`

## Trade-offs (be honest)

- **Lose SSR/SEO from server-rendered HTML.** SPAs render client-side, so social-media crawlers see an empty shell unless the backend team adds SSR or pre-rendering. For a portfolio site this is usually fine; for heavy SEO, recommend they add a meta-tag library like `react-helmet-async` (I'll include it) and consider pre-rendering at deploy time.
- **No more Lovable Cloud auth/storage.** If you later need login, your team builds it.
- **Lovable preview still works** because the mock adapter ships real data — you can keep iterating on design here, then hand the zip to your team.

## Files touched (high-level)

- **Delete**: `src/routes/`, `src/router.tsx`, `src/start.ts`, `src/routeTree.gen.ts`, `src/integrations/supabase/`, `src/lib/artist.functions.ts`, `supabase/`
- **Create**: `index.html`, `src/main.tsx`, `src/App.tsx`, `src/pages/Home.tsx`, `src/pages/Artist.tsx`, `src/lib/api/*`, `API-SPEC.md`, `public/_redirects`
- **Edit**: `package.json` (swap deps), `vite.config.ts` (remove TanStack plugins)

After this, your backend team gets a totally standard `Vite + React + React Router + Tailwind + shadcn` project — the most common React stack on earth. Anyone can pick it up.

Approve and I'll execute.
