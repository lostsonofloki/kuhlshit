/**
 * Normalize text for loose search: lowercase, strip punctuation, collapse spaces.
 * @param {string | undefined | null} str
 */
export function normalizeSearchText(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string | undefined | null} str
 */
export function compactSearchText(str) {
  return normalizeSearchText(str).replace(/\s/g, "");
}

/**
 * Whether `query` loosely matches `text` (e.g. "BB" matches "B.B. Palmer").
 * @param {string | undefined | null} text
 * @param {string | undefined | null} query
 */
export function textMatchesSearch(text, query) {
  const normText = normalizeSearchText(text);
  const compactText = compactSearchText(text);
  const normQuery = normalizeSearchText(query);
  const compactQuery = compactSearchText(query);

  if (!normQuery) return true;

  if (normText.includes(normQuery) || compactText.includes(compactQuery)) {
    return true;
  }

  const tokens = normQuery.split(" ").filter(Boolean);
  if (tokens.length > 1) {
    return tokens.every(
      (token) =>
        normText.includes(token) ||
        compactText.includes(compactSearchText(token)),
    );
  }

  return false;
}

/**
 * @param {(string | undefined | null)[]} fields
 * @param {string | undefined | null} query
 */
export function fieldsMatchSearch(fields, query) {
  return fields.some((field) => field && textMatchesSearch(field, query));
}
