import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "../components/SEO";
import { trackEvent } from "../utils/analytics";
import "./WaitlistPage.css";

const STORAGE_KEY = "kuhlshit-waitlist-signups";
/**
 * Optional Google Form / Formspree / serverless endpoint.
 * Pointing this at a real URL (via `VITE_WAITLIST_ENDPOINT`) is enough to
 * start collecting signups without a backend; the local fallback below
 * keeps a draft log in `localStorage` so submissions never silently drop.
 */
const REMOTE_ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT;

function saveLocally(entry) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-50)));
  } catch {
    // Storage blocked (private mode, quota, etc.) — submission UX still succeeds.
  }
}

function WaitlistPage() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [craft, setCraft] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorText("We need a real email so we can reach out.");
      return;
    }
    setStatus("submitting");
    setErrorText("");

    const entry = {
      name: name.trim(),
      email: email.trim(),
      craft: craft.trim(),
      link: link.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    let remoteOk = false;
    if (REMOTE_ENDPOINT) {
      try {
        const response = await fetch(REMOTE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        remoteOk = response.ok;
      } catch {
        remoteOk = false;
      }
    }

    saveLocally({ ...entry, remoteOk });
    trackEvent("waitlist_submit", {
      has_craft: Boolean(entry.craft),
      has_link: Boolean(entry.link),
      remote_ok: remoteOk,
      source: searchParams.get("source") || "direct",
    });
    setStatus("success");
  };

  if (status === "success") {
    return (
      <>
        <SEO
          title="You're on the list | kuhlshit.com"
          description="Thanks for joining the Kuhlshit creator waitlist."
          path="/waitlist"
        />
        <div className="waitlist-page waitlist-page--success">
          <div className="waitlist-card">
            <p className="waitlist-eyebrow">You&apos;re on the list</p>
            <h1>You&apos;re in.</h1>
            <p>
              We&apos;ll reach out from <strong>hello@kuhlshit.com</strong> as
              soon as the Creator Studio opens its doors. In the meantime, go
              make something real.
            </p>
            <div className="waitlist-success-actions">
              <Link to="/" className="btn btn-secondary">
                Back to the home page
              </Link>
              <Link to="/vault" className="btn btn-ghost">
                Peek inside The Vault
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Join the creator waitlist | kuhlshit.com"
        description="Join the Kuhlshit creator waitlist — a global home for musicians, painters, and poets building their own stage."
        path="/waitlist"
      />
      <div className="waitlist-page">
        <div className="waitlist-card">
          <p className="waitlist-eyebrow">Creator Waitlist</p>
          <h1>Join the creator waitlist.</h1>
          <p className="waitlist-lede">
            Tell us who you are and what you&apos;re building. We&apos;re
            opening the Creator Studio to musicians, visual artists, and
            writers in waves — the earliest folks in get their pick of the
            handles.
          </p>

          <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
            <label className="waitlist-field">
              <span>Your name or project</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How you want to be credited"
                autoComplete="name"
              />
            </label>

            <label className="waitlist-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="waitlist-field">
              <span>What do you create? (optional)</span>
              <input
                type="text"
                value={craft}
                onChange={(e) => setCraft(e.target.value)}
                placeholder="A few words — medium, style, whatever fits"
                autoComplete="off"
              />
            </label>

            <label className="waitlist-field">
              <span>A link we can listen to, look at, or read (optional)</span>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Spotify, portfolio, Substack, Bandcamp…"
              />
            </label>

            <label className="waitlist-field">
              <span>Anything else we should know? (optional)</span>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="City, vibe, what you need a home on the internet for."
              />
            </label>

            {errorText ? (
              <p className="waitlist-error" role="alert">
                {errorText}
              </p>
            ) : null}

            <button
              type="submit"
              className="btn btn-primary hero-cta--waitlist waitlist-submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : "Put me on the list"}
            </button>

            <p className="waitlist-fineprint">
              No spam, ever. We&apos;ll only email you when the platform is
              ready for your craft.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default WaitlistPage;
