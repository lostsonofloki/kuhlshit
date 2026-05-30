import { fieldsMatchSearch } from "../utils/searchMatch.js";

/**
 * Client-side search over bundled festival data (artists + PorchFest events).
 * @param {string} query
 * @param {{ artists?: unknown[], porchfest?: { events?: unknown[] } }} data
 */
export function searchSite(query, data) {
  const q = String(query || "").trim();
  if (!q) {
    return { artists: [], events: [] };
  }

  const artistResults = (data.artists || []).filter((artist) =>
    fieldsMatchSearch(
      [artist.name, artist.location, artist.bio],
      q,
    ),
  );

  const events = data.porchfest?.events || [];
  const eventResults = events.filter((event) =>
    fieldsMatchSearch(
      [
        event.name,
        event.location?.city,
        event.location?.state,
        event.description,
      ],
      q,
    ),
  );

  return { artists: artistResults, events: eventResults };
}
