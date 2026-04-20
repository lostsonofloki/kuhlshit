import { Link } from "react-router-dom";
import "./CreatorCategories.css";

/**
 * Teaser strip for creator types the platform will support — cards link
 * to shows (Closed on Sundays, PorchTalk) or the waitlist where relevant.
 */
const CATEGORIES = [
  {
    id: "musician",
    title: "Musicians",
    blurb: "Tour dates, streaming embeds, and a home page that actually books shows.",
    accent: "musician",
    to: "/closed-on-sundays",
    cta: "See it on Closed on Sundays →",
  },
  {
    id: "visual",
    title: "Painters & Photographers",
    blurb: "High-res galleries where the image is the hero, not the menu bar.",
    accent: "visual",
    to: "/waitlist?source=categories",
    cta: "Get on the list →",
  },
  {
    id: "writer",
    title: "Poets & Writers",
    blurb: "Distraction-free reading. Your words, not our chrome.",
    accent: "writer",
    to: "/porch-talk",
    cta: "Hear the stories on PorchTalk →",
  },
];

export default function CreatorCategories() {
  return (
    <section className="section creator-categories-section">
      <div className="section-header">
        <h2>Built for every kind of creator</h2>
      </div>
      <div className="creator-categories-grid">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={category.to}
            className={`creator-category-card creator-category-card--${category.accent}`}
          >
            <h3>{category.title}</h3>
            <p>{category.blurb}</p>
            <span className="creator-category-cta">{category.cta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
