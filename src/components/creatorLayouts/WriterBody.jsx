import { Link } from "react-router-dom";
import "./WriterBody.css";

/**
 * Writer / poet layout: Medium-style reading mode. No icons, no social buttons
 * competing for attention — just title, author, and the words.
 *
 * `artist.works` is expected to be an array of `{ title, subtitle?, body, year? }`.
 * If no works are provided, the bio becomes the text so early profiles still
 * feel like a reading destination.
 */
export default function WriterBody({ artist }) {
  const works =
    Array.isArray(artist.works) && artist.works.length > 0
      ? artist.works
      : [
          {
            title: "About this writer",
            body: artist.bio,
          },
        ];

  return (
    <div className="writer-body">
      {works.map((work, i) => (
        <article key={i} className="writer-piece">
          {work.year ? (
            <p className="writer-piece-year">{work.year}</p>
          ) : null}
          <h2 className="writer-piece-title">{work.title}</h2>
          {work.subtitle ? (
            <p className="writer-piece-subtitle">{work.subtitle}</p>
          ) : null}
          <div className="writer-piece-body">
            {String(work.body || "")
              .split(/\n\s*\n/)
              .map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
          </div>
        </article>
      ))}

      <aside className="writer-footer">
        <p>
          Want to follow this writer? They&apos;ll post new work on Kuhlshit as
          soon as the Creator Studio opens.
        </p>
        <Link to="/waitlist" className="btn btn-ghost">
          Join the creator waitlist
        </Link>
      </aside>
    </div>
  );
}
