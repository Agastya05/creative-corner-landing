# AR.02 Artist Platform — Frontend Handoff Document

> **For the backend team:** This project is designed to be framework-agnostic. All business logic, data fetching, and UI components live in plain React files with **zero** TanStack Start or Supabase lock-in. The thin routing shell in `src/routes/` is the only TanStack-specific layer and is trivial to replace.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Philosophy](#2-architecture-philosophy)
3. [Folder Structure](#3-folder-structure)
4. [The Adapter Pattern (Key Concept)](#4-the-adapter-pattern-key-concept)
5. [API Contract](#5-api-contract)
6. [Migration Guide: TanStack Start → Plain Vite SPA](#6-migration-guide-tanstack-start--plain-vite-spa)
7. [Environment Variables](#7-environment-variables)
8. [Design System & Styling](#8-design-system--styling)
9. [Component Inventory](#9-component-inventory)
10. [Quick Start for Backend Team](#10-quick-start-for-backend-team)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Project Overview

**AR.02** is a contemporary art platform showcasing artists and their work. The current build features a rich artist profile page with biography, studio photography, exhibition history, and an artwork catalog.

- **Frontend framework:** React 19 + TypeScript + Tailwind CSS v4
- **Current shell:** TanStack Start (file-based routing, SSR)
- **Target stack:** Plain Vite SPA + React Router DOM
- **Data layer:** Swappable adapter (mock ↔ REST)
- **Backend dependency:** Your REST API (see API-SPEC.md)

---

## 2. Architecture Philosophy

The codebase follows a **shell-and-core** pattern:

| Layer | Purpose | Framework Lock-in |
|-------|---------|------------------|
| **Shell** (`src/routes/*.tsx`) | URL routing, meta tags, param extraction | TanStack Start only |
| **Core** (`src/pages/`, `src/components/`, `src/lib/api/`) | All UI, data fetching, business logic | **Zero** — plain React |

**This means:** When you migrate to your own stack, you only replace the shell. All the real code — components, hooks, API logic, styles — copies over unchanged.

---

## 3. Folder Structure

```
├── public/                      # Static assets (images, fonts, favicon)
│   ├── artist-hero-bg.jpg
│   ├── priya-portrait.jpg
│   ├── studio-*.jpg
│   └── ...
│
├── src/
│   ├── components/ui/           # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   │   └── button.tsx
│   │   └── ...
│   │
│   ├── lib/
│   │   └── api/                 # ← THE IMPORTANT PART
│   │       ├── types.ts         # Artist, Artwork interfaces (source of truth)
│   │       ├── mock-adapter.ts  # Hardcoded data for local dev
│   │       ├── rest-adapter.ts  # Generic fetch() to your API
│   │       └── index.ts         # One-line switch: mock vs REST
│   │
│   ├── pages/
│   │   └── ArtistPage.tsx       # Plain React page. All artist UI lives here.
│   │                              # Uses useEffect + useState. No loaders. No SSR.
│   │
│   ├── routes/                  # ← TANSTACK SHELL ONLY (replaceable)
│   │   ├── __root.tsx           # Root layout (html/head/body shell)
│   │   ├── index.tsx            # Homepage route
│   │   └── artist.$slug.tsx     # Artist page route (30 lines, passes slug to ArtistPage)
│   │
│   ├── styles.css               # Tailwind v4 setup + design tokens (colors, fonts)
│   └── ...
│
├── API-SPEC.md                  # Full JSON contract for your backend
├── vite.config.ts               # Vite + TanStack plugins (replace with plain Vite config)
├── tsconfig.json                # Path aliases: `@/` → `src/`
└── package.json
```

### What to copy to your new project

When migrating, copy these directories **as-is**:
- `src/components/` (all UI primitives and shared components)
- `src/lib/api/` (types + adapters)
- `src/pages/` (page components)
- `src/styles.css` (design system)
- `public/` (static assets)

**Do NOT copy:**
- `src/routes/` — replace with your router (React Router, etc.)
- `vite.config.ts` — create a fresh Vite config

---

## 4. The Adapter Pattern (Key Concept)

The frontend decides at runtime whether to use mock data or call your API. This is controlled by **one environment variable**.

### How it works

```typescript
// src/lib/api/index.ts
const baseUrl = import.meta.env.VITE_API_BASE_URL; // undefined = mock mode

export const artistApi = baseUrl
  ? createRestAdapter(baseUrl)   // → calls your API
  : mockAdapter;                 // → returns hardcoded data
```

| Mode | Condition | What happens |
|------|-----------|-------------|
| **Mock** | `VITE_API_BASE_URL` is unset | `mockAdapter` serves hardcoded artist data. Great for design iteration without a backend. |
| **Live** | `VITE_API_BASE_URL=https://api.yoursite.com` | `restAdapter` makes `fetch()` calls to your API endpoints. |

### Usage in components

Components are completely agnostic to which adapter is active:

```typescript
// src/pages/ArtistPage.tsx
import { artistApi } from "@/lib/api";

useEffect(() => {
  artistApi.getArtistBySlug(slug)     // works with mock OR REST
  artistApi.getArtworksByArtist(slug) // works with mock OR REST
}, [slug]);
```

**No code changes required anywhere when switching adapters.**

---

## 5. API Contract

See **`API-SPEC.md`** in the project root for the complete specification. Here is the summary:

### Endpoints to implement

| Method | Endpoint | Response |
|--------|----------|----------|
| `GET` | `/artists/:slug` | Single `Artist` object (JSON) |
| `GET` | `/artists/:slug/artworks` | Array of `Artwork` objects (JSON) |

### TypeScript types (source of truth)

```typescript
// src/lib/api/types.ts

export interface Artist {
  slug: string;
  name: string;
  city: string;
  movement: string;
  job_title: string;
  nationality: string;
  bio_paragraphs: string[];          // may contain inline HTML
  stats: {
    based_in: string;
    practice: string;
    exhibitions: string;
    years_active: string;
  };
  education: Array<{ degree: string; school: string; year: string }>;
  accolades: Array<{ name: string; category: string; year: string }>;
  exhibitions_solo: Array<{ name: string; venue: string; date: string }>;
  exhibitions_group: Array<{ name: string; venue: string; date: string }>;
  theme: { bg: string; text: string; cream: string; accent: string };
  images: {
    hero_bg: string;          // publicly fetchable URL
    portrait: string;
    studio_wide: string;
    studio_hands: string;
    studio_flatlay: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    og_title: string;
    og_description: string;
  };
  studio_quote: string;
  studio_quote_author: string;
  artwork_for_sale_title: string;
  artwork_for_sale_subtitle: string;
}

export interface Artwork {
  id: string;
  name: string;
  medium: string;
  price: number;              // integer in local currency
  palette: [string, string];  // exactly two hex colors
  image_url: string | null;   // null → frontend renders gradient
}
```

### Backend notes

- **CORS:** Enable CORS for your frontend origin.
- **HTML in bio:** `bio_paragraphs` may contain `<strong>`, `<em>`, etc. Sanitize on write, not read.
- **Images:** All `images.*` values must be publicly accessible URLs (CDN, S3, etc.).
- **Artwork images:** When `image_url` is `null`, the frontend renders a CSS gradient using `palette[0]` and `palette[1]`.
- **Sold items:** Filter sold artworks server-side. The frontend assumes everything returned is available.
- **Currency:** Prices are rendered with `₹` formatting (`toLocaleString("en-IN")`). If you need multi-currency support, let the design team know.

---

## 6. Migration Guide: TanStack Start → Plain Vite SPA

This is a ~15 minute mechanical migration. No business logic needs rewriting.

### Step 1: Scaffold a new Vite project

```bash
npm create vite@latest my-art-platform -- --template react-ts
cd my-art-platform
npm install
```

### Step 2: Add dependencies

```bash
npm install react-router-dom tailwindcss @tailwindcss/vite
```

Also install any shadcn/ui primitives you need from `src/components/ui/`:

```bash
# Example — add whatever the copied components import
npm install class-variance-authority clsx tailwind-merge lucide-react
```

### Step 3: Copy portable code

```bash
# From the Lovable project, copy these directories:
cp -r ../lovable-project/src/components ./src/
cp -r ../lovable-project/src/lib ./src/
cp -r ../lovable-project/src/pages ./src/
cp ../lovable-project/src/styles.css ./src/
cp -r ../lovable-project/public/* ./public/
```

### Step 4: Create a fresh Vite config

Replace `vite.config.ts` with a plain Vite + React + Tailwind setup:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

### Step 5: Replace TanStack routes with React Router

**Create `src/App.tsx`:**

```tsx
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import ArtistPage from "@/pages/ArtistPage";

function ArtistRoute() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <div>Missing slug</div>;
  return <ArtistPage slug={slug} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Homepage</div>} />
        <Route path="/artist/:slug" element={<ArtistRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Update `src/main.tsx`:**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Step 6: Add environment config

Create `.env` in project root:

```bash
# Development (uses mock data)
# VITE_API_BASE_URL=

# Production (your live API)
VITE_API_BASE_URL=https://api.yourdomain.com
```

In a plain Vite app, use `import.meta.env.VITE_API_BASE_URL` — it's already used in `src/lib/api/index.ts`.

### Step 7: Update `index.html`

Ensure `index.html` has a root div:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AR.02 — Contemporary Art Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 8: Build & test

```bash
npm run dev      # Test with mock data
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 7. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | No | Base URL of your backend API. When set, `restAdapter` is used. When unset, `mockAdapter` serves hardcoded data. |

> **Note:** Vite only exposes env vars prefixed with `VITE_` to the client bundle.

---

## 8. Design System & Styling

The project uses **Tailwind CSS v4** with custom design tokens defined in `src/styles.css`.

### Key design tokens

```css
/* src/styles.css — custom properties */
--font-display: "Playfair Display", Georgia, serif;
--font-italic: "Cormorant Garamond", Georgia, serif;
--ochre: oklch(0.78 0.155 80);
--ochre-deep: oklch(0.62 0.145 70);
--ink: oklch(0.18 0.03 80);
--cream: oklch(0.97 0.025 90);
```

### Font loading

The page expects these Google Fonts (loaded in `__root.tsx` or your HTML shell):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet">
```

### Custom CSS classes used

- `font-display` — headings (Playfair Display)
- `font-italic` — italic body text (Cormorant Garamond)
- `text-cream`, `text-[var(--ink)]`, `bg-[var(--ochre)]` — semantic color usage

---

## 9. Component Inventory

### Page components (`src/pages/`)

| Component | File | Description |
|-----------|------|-------------|
| `ArtistPage` | `ArtistPage.tsx` | Full artist profile page. Accepts `slug: string` prop. Fetches data via `artistApi`. Contains Hero, Bio, Studio, Exhibitions, and Artwork Catalog sections. |

### shadcn/ui primitives (`src/components/ui/`)

The project uses standard shadcn/ui components (Button, Card, Dialog, etc.). These are unstyled Radix primitives wrapped with Tailwind classes. When migrating, ensure you install matching versions or let Tailwind classes handle the styling.

### Sections inside ArtistPage

The `ArtistPage` component is self-contained and renders these sections in order:

1. **Hero** — Marquee banner, circular portrait, artist name, movement badges
2. **Information** — Biography, stats grid, education timeline, accolades
3. **Studio** — Dark section with studio photography grid, artist quote
4. **Exhibitions** — Solo and group exhibition lists
5. **ArtworkForSale** — Artwork grid with gradient placeholders, pricing, expand/collapse

---

## 10. Quick Start for Backend Team

### Option A: Work with the existing codebase (recommended during development)

```bash
# 1. Clone the repo
git clone <repo-url>
cd <project>

# 2. Install dependencies
npm install

# 3. Run with mock data (no backend needed)
npm run dev

# 4. Open http://localhost:5173/artist/priya-desai
```

### Option B: Start your own Vite project

Follow the [Migration Guide](#6-migration-guide-tanstack-start--plain-vite-spa) above.

### Option C: Backend-first development

1. Implement the two endpoints from `API-SPEC.md`
2. Set `VITE_API_BASE_URL=https://your-api.com` in `.env`
3. Restart `npm run dev`
4. The frontend now calls your live API automatically

---

## 11. Troubleshooting

### "Artist not found" error
- Check that `GET /artists/:slug` returns 200 for the slug you're testing.
- Verify the slug format matches (e.g., `priya-desai`, not `Priya Desai`).

### CORS errors in browser console
- Your backend must send `Access-Control-Allow-Origin` headers.
- For development, allow `http://localhost:5173`.

### Images not loading
- `images.*` URLs in the Artist response must be publicly accessible.
- If using local images, place them in `public/` and use root-relative paths (e.g., `/priya-portrait.jpg`).

### Gradients instead of artwork images
- This is expected when `image_url` is `null`. The frontend renders a CSS gradient using the `palette` colors.
- To show real images, populate `image_url` in your API response.

### Styles look wrong after migration
- Ensure `src/styles.css` is imported in your entry file.
- Ensure Tailwind CSS v4 is properly configured in `vite.config.ts`.
- Verify Google Fonts (Playfair Display, Cormorant Garamond) are loaded.

### TypeScript path alias `@/` not resolving
- Ensure your `vite.config.ts` has the `resolve.alias` config (see Step 4).
- Ensure `tsconfig.json` has `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }`.

---

## Contact & Questions

- **API contract questions?** → See `API-SPEC.md`
- **Type definitions?** → See `src/lib/api/types.ts`
- **Adapter logic?** → See `src/lib/api/index.ts`
- **UI questions?** → See `src/pages/ArtistPage.tsx` (all UI is in one file)

---

*Last updated: 2025-06-15*
