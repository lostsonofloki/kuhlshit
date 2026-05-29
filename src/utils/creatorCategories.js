/** @typedef {'musician' | 'visual' | 'writer'} CreatorCategory */

export const CREATOR_TAB_ALL = "all";

export const CREATOR_TABS = [
  { id: CREATOR_TAB_ALL, label: "All" },
  { id: "musician", label: "Musicians" },
  { id: "visual", label: "Painters" },
  { id: "writer", label: "Poets & Writers" },
];

/**
 * Normalize raw creatorType / creatorTypes values to a canonical category.
 * @param {string | undefined} raw
 * @returns {CreatorCategory}
 */
export function normalizeCreatorCategory(raw) {
  const t = String(raw || "musician").toLowerCase();
  if (t === "visual" || t === "painter" || t === "photographer") return "visual";
  if (t === "writer" || t === "poet") return "writer";
  return "musician";
}

/**
 * All categories this profile belongs to (for browse tabs).
 * Supports `creatorTypes[]` plus legacy single `creatorType`.
 * @param {object | null | undefined} artist
 * @returns {CreatorCategory[]}
 */
export function resolveCreatorTypes(artist) {
  if (!artist) return ["musician"];

  const set = new Set();

  if (Array.isArray(artist.creatorTypes)) {
    for (const raw of artist.creatorTypes) {
      set.add(normalizeCreatorCategory(raw));
    }
  }

  if (artist.creatorType) {
    set.add(normalizeCreatorCategory(artist.creatorType));
  }

  if (set.size === 0) set.add("musician");

  return [...set];
}

/**
 * Primary layout category for the artist detail page (single layout).
 * @param {object | null | undefined} artist
 * @returns {CreatorCategory}
 */
export function resolvePrimaryCreatorType(artist) {
  if (!artist) return "musician";
  if (artist.creatorType) return normalizeCreatorCategory(artist.creatorType);
  const types = resolveCreatorTypes(artist);
  return types[0] || "musician";
}

/**
 * @param {object} artist
 * @param {string} tabId
 */
export function artistMatchesCreatorTab(artist, tabId) {
  if (!tabId || tabId === CREATOR_TAB_ALL) return true;
  return resolveCreatorTypes(artist).includes(
    /** @type {CreatorCategory} */ (tabId),
  );
}

/**
 * @param {object[]} artists
 * @param {string} tabId
 */
export function countArtistsInCreatorTab(artists, tabId) {
  if (!Array.isArray(artists)) return 0;
  return artists.filter((a) => artistMatchesCreatorTab(a, tabId)).length;
}
