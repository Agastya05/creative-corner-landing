import { mockAdapter } from "./mock-adapter";
import { createRestAdapter } from "./rest-adapter";

/**
 * The single switch your backend team flips.
 *
 *   - No env var set  → mock data (great for design/preview).
 *   - VITE_API_BASE_URL set → calls your real REST API.
 *
 * No other file in the app needs to change.
 */
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const artistApi = baseUrl ? createRestAdapter(baseUrl) : mockAdapter;
