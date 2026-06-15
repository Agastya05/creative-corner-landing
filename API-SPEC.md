# Artist API — Backend Contract

The frontend talks to your backend through **one file**:
`src/lib/api/index.ts`. It picks an adapter based on an env var.

| `VITE_API_BASE_URL` | Adapter used | Behavior |
| --- | --- | --- |
| _unset_ | `mockAdapter` | Returns hardcoded data from `src/lib/api/mock-adapter.ts`. Great for local dev and design iteration. |
| `https://api.example.com` | `restAdapter` | Calls your REST endpoints below. |

No other file in the app needs to change when you wire up the real API.

---

## Endpoints to implement

Base URL = `VITE_API_BASE_URL`. All responses are JSON.

### `GET /artists/:slug`

Returns a single artist. `:slug` is a URL-safe identifier (e.g. `priya-desai`).

**200 OK** — body matches the `Artist` shape in `src/lib/api/types.ts`:

```json
{
  "slug": "priya-desai",
  "name": "Priya Desai",
  "city": "Mumbai, India",
  "movement": "Abstract Expressionism",
  "job_title": "Abstract Expressionist Painter",
  "nationality": "Indian",
  "bio_paragraphs": [
    "<strong>Priya Desai</strong> is a Mumbai-based painter…",
    "After completing her <strong>MFA</strong>…"
  ],
  "stats": {
    "based_in": "Mumbai, IN",
    "practice": "Abstract",
    "exhibitions": "14+",
    "years_active": "9"
  },
  "education": [
    { "degree": "MFA, Contemporary Art", "school": "Mumbai Institute of Art", "year": "2016" }
  ],
  "accolades": [
    { "name": "Contemporary Art Innovation Prize", "category": "Abstract Expressionism", "year": "2024" }
  ],
  "exhibitions_solo": [
    { "name": "Color Language", "venue": "Gallerie Arts Mumbai", "date": "Mar – May 2024" }
  ],
  "exhibitions_group": [
    { "name": "New Horizons", "venue": "National Center for the Arts", "date": "Jan – Mar 2024" }
  ],
  "theme": {
    "bg": "var(--ochre)",
    "text": "var(--ink)",
    "cream": "var(--cream)",
    "accent": "var(--ochre-deep)"
  },
  "images": {
    "hero_bg": "https://cdn.example.com/priya/hero.jpg",
    "portrait": "https://cdn.example.com/priya/portrait.jpg",
    "studio_wide": "https://cdn.example.com/priya/studio-wide.jpg",
    "studio_hands": "https://cdn.example.com/priya/studio-hands.jpg",
    "studio_flatlay": "https://cdn.example.com/priya/studio-flat.jpg"
  },
  "seo": {
    "title": "Priya Desai — Abstract Expressionist Painter",
    "description": "Discover Priya Desai…",
    "keywords": "Priya Desai, abstract expressionist…",
    "og_title": "Priya Desai — Abstract Expressionist Painter",
    "og_description": "Bold color, dynamic composition…"
  },
  "studio_quote": "The studio is the only place where colour stops being decoration…",
  "studio_quote_author": "Priya Desai",
  "artwork_for_sale_title": "Artwork for Sale",
  "artwork_for_sale_subtitle": "Original Pieces · Priya Desai"
}
```

**404** when the slug doesn't exist. The frontend renders an "Artist not found" state.

Notes:
- `bio_paragraphs` items may contain inline HTML (`<strong>`, `<em>`). Sanitize on write.
- `theme.*` values are CSS expressions — either hex (`#C2410C`) or CSS variables (`var(--ochre)`).
- `images.*` must be publicly fetchable URLs (CDN or your storage).

### `GET /artists/:slug/artworks`

Returns the artist's available artworks, ordered for display.

**200 OK** — array of `Artwork`:

```json
[
  {
    "id": "artwork-001",
    "name": "Chromatic Harmony",
    "medium": "Oil on Canvas",
    "price": 22119,
    "palette": ["#C2410C", "#1F2937"],
    "image_url": null
  }
]
```

Notes:
- `price` is an integer in the artist's local currency (currently rendered as `₹`).
- `palette` is exactly two hex colors. The frontend renders a gradient when `image_url` is `null`.
- `image_url` may be `null` (placeholder gradient) or a public URL.
- Filter out sold pieces on the server. The frontend does not check availability.

---

## TypeScript types (source of truth)

See `src/lib/api/types.ts`. Any backend that returns JSON matching those
interfaces will work — language and framework on your side don't matter.

## Quick wiring checklist

1. Backend exposes the two endpoints above.
2. Frontend `.env.production`: `VITE_API_BASE_URL=https://your-api.example.com`
3. `npm run build` and deploy. Done.