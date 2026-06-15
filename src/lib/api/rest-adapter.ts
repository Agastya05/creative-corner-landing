import type { ArtistAPI } from "./types";

/**
 * REST adapter — used when VITE_API_BASE_URL is set.
 * Your backend just needs to implement the two endpoints documented
 * in /API-SPEC.md and return JSON matching the Artist / Artwork types.
 */
export function createRestAdapter(baseUrl: string): ArtistAPI {
  const base = baseUrl.replace(/\/$/, "");

  async function getJson<T>(path: string): Promise<T> {
    const res = await fetch(`${base}${path}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`API ${res.status} on ${path}`);
    }
    return (await res.json()) as T;
  }

  return {
    getArtistBySlug: (slug) => getJson(`/artists/${encodeURIComponent(slug)}`),
    getArtworksByArtist: (slug) =>
      getJson(`/artists/${encodeURIComponent(slug)}/artworks`),
  };
}