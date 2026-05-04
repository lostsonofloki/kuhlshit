import { normalizeLineupEntry } from "./porchfestScheduleStatus";

function looksLikeBandName(name) {
  const n = String(name || "").trim();
  if (/^the\s+/i.test(n)) return true;
  if (/\b(and|&)\b/i.test(n)) return true;
  return false;
}

/** @param {'musician' | 'visual' | 'writer'} creatorType */
function schemaPrimaryType(creatorType, artistName) {
  if (creatorType === "musician") {
    return looksLikeBandName(artistName) ? "MusicGroup" : "Person";
  }
  return "Person";
}

function collectSameAs(artist) {
  const out = [];
  const push = (u) => {
    if (u && typeof u === "string" && /^https?:\/\//i.test(u)) out.push(u);
  };
  const social = artist?.socialLinks || {};
  const music = artist?.musicLinks || {};
  const extra = artist?.links || {};
  Object.values(social).forEach(push);
  Object.values(music).forEach(push);
  Object.values(extra).forEach(push);
  return [...new Set(out)];
}

export function artistInFestivalLineup(artist, event) {
  if (!event?.lineup?.length || !artist?.name) return false;
  const target = artist.name.trim().toLowerCase();
  for (const block of event.lineup) {
    for (const entry of block.artists || []) {
      const nm = normalizeLineupEntry(entry).name.trim().toLowerCase();
      if (nm === target) return true;
    }
  }
  return false;
}

/**
 * @param {{
 *   artist: object,
 *   creatorType: 'musician' | 'visual' | 'writer',
 *   canonicalUrl: string,
 *   absoluteImage: string,
 *   festivalEvent: object | null,
 *   includeEvent: boolean,
 * }} opts
 */
export function buildArtistJsonLd({
  artist,
  creatorType,
  canonicalUrl,
  absoluteImage,
  festivalEvent,
  includeEvent,
}) {
  const idCreator = `${canonicalUrl}#creator`;
  const sameAs = collectSameAs(artist);
  const primaryType = schemaPrimaryType(creatorType, artist.name);

  const bio =
    artist.bio && String(artist.bio).trim()
      ? String(artist.bio).trim().replace(/\s+/g, " ")
      : undefined;

  /** @type {Record<string, unknown>} */
  const mainEntity = {
    "@type": primaryType,
    "@id": idCreator,
    name: artist.name,
    url: canonicalUrl,
    description: bio,
  };

  if (absoluteImage) mainEntity.image = absoluteImage;
  if (artist.genre) mainEntity.genre = artist.genre;
  if (sameAs.length) mainEntity.sameAs = sameAs;
  if (artist.location) {
    mainEntity.homeLocation = {
      "@type": "Place",
      name: artist.location,
    };
  }

  const graph = [mainEntity];

  if (includeEvent && festivalEvent?.date) {
    const loc = festivalEvent.location || {};
    /** @type {Record<string, unknown>} */
    const place = { "@type": "Place" };
    if (loc.venue) place.name = loc.venue;
    const addrBits = {};
    if (loc.address) addrBits.streetAddress = loc.address;
    if (loc.city) addrBits.addressLocality = loc.city;
    if (loc.state) addrBits.addressRegion = loc.state;
    if (Object.keys(addrBits).length) {
      place.address = { "@type": "PostalAddress", ...addrBits };
    }
    if (loc.mapUrl) place.hasMap = loc.mapUrl;

    /** @type {Record<string, unknown>} */
    const ev = {
      "@type": "Event",
      "@id": `${canonicalUrl}#festival-performance`,
      name: festivalEvent.name || "PorchFest",
      startDate: festivalEvent.date,
      endDate: festivalEvent.endDate || festivalEvent.date,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      performer: { "@id": idCreator },
    };
    if (place.name || place.address) ev.location = place;

    graph.push(ev);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
