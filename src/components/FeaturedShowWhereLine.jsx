import { getAlsSpiritsWhereLinkParts } from "../constants/alsSpirits";

/**
 * Featured-show “where” line: links Al's Spirits & Music to Google Maps when the string matches data.json.
 *
 * @param {object} props
 * @param {string} props.where
 * @param {string} [props.hrefOverride] e.g. hub row `location.mapUrl` when present
 * @param {keyof JSX.IntrinsicElements} [props.as]
 * @param {string} [props.className]
 * @param {string} [props.linkClassName]
 */
export default function FeaturedShowWhereLine({
  where,
  hrefOverride,
  as: Tag = "p",
  className = "featured-show-line",
  linkClassName = "",
}) {
  const parts = getAlsSpiritsWhereLinkParts(where);
  if (!parts) {
    return <Tag className={className}>{where}</Tag>;
  }
  const href = hrefOverride || parts.href;
  const ariaLabel = parts.remainderText
    ? `Open ${parts.venueText} in Google Maps (${parts.remainderText})`
    : `Open ${parts.venueText} in Google Maps`;
  return (
    <Tag className={className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName || undefined}
        aria-label={ariaLabel}
      >
        {parts.venueText}
      </a>
      {parts.remainderText ? (
        <>
          {" · "}
          {parts.remainderText}
        </>
      ) : null}
    </Tag>
  );
}
