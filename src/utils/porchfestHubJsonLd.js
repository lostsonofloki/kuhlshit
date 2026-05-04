import { getSiteOrigin, toAbsoluteUrl } from "./siteOrigin";

/**
 * JSON-LD for the /porchfest hub. Uses only fields present on the festival event from data.
 *
 * @param {object} event – A `porchfest.events[]` entry (e.g. `pf-001`).
 * @returns {object | null}
 */
export function buildPorchfestHubJsonLd(event) {
  if (!event?.date) return null;

  const origin = getSiteOrigin();
  const loc = event.location || {};

  /** @type {Record<string, unknown>} */
  const place = { "@type": "Place" };
  if (loc.venue) place.name = loc.venue;

  const addrBits = {};
  if (loc.address) addrBits.streetAddress = loc.address;
  if (loc.city) addrBits.addressLocality = loc.city;
  if (loc.state) addrBits.addressRegion = loc.state;
  if (loc.state === "MS") addrBits.addressCountry = "US";
  if (Object.keys(addrBits).length) {
    place.address = { "@type": "PostalAddress", ...addrBits };
  }
  if (loc.mapUrl) place.hasMap = loc.mapUrl;
  if (loc.website) place.url = loc.website;

  const imagePath = event.imageUrl || event.lineupImageUrl;
  const image = imagePath ? toAbsoluteUrl(origin, imagePath) : undefined;

  /** @type {Record<string, unknown>} */
  const festival = {
    "@type": "Festival",
    "@id": `${origin}/porchfest#festival`,
    name: event.name,
    startDate: event.date,
    endDate: event.endDate || event.date,
    description: event.description,
    url: `${origin}/porchfest`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };

  if (place.name || place.address) festival.location = place;
  if (image) festival.image = image;

  return {
    "@context": "https://schema.org",
    "@graph": [festival],
  };
}
