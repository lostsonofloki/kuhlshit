import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import data from '../data/data.json'
import { searchSite } from '../lib/siteSearch'
import './HeaderSiteSearch.css'

function HeaderSiteSearch({ onNavigate }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const panelId = useId()

  const results = useMemo(() => searchSite(query, data), [query])

  const total = results.artists.length + results.events.length

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  useEffect(() => {
    close()
  }, [location.pathname, close])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('touchstart', onDoc, { passive: true })
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('touchstart', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onPick = () => {
    onNavigate?.()
    close()
  }

  return (
    <div className="header-site-search" ref={wrapRef}>
      <button
        type="button"
        className="header-search-btn"
        aria-label="Open site search"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {open ? (
        <div id={panelId} className="header-site-search-panel" role="dialog" aria-label="Search site">
          <label className="header-site-search-label visually-hidden" htmlFor={`${panelId}-input`}>
            Search artists and events
          </label>
          <input
            id={`${panelId}-input`}
            ref={inputRef}
            type="search"
            className="header-site-search-input"
            placeholder="Artists, city, event…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck="false"
          />

          <div className="header-site-search-results" aria-label="Results">
            {!query.trim() ? (
              <p className="header-site-search-hint">Type to search creators and PorchFest listings.</p>
            ) : total === 0 ? (
              <p className="header-site-search-empty">No matches.</p>
            ) : (
              <>
                {results.artists.length > 0 ? (
                  <div className="header-site-search-group">
                    <div className="header-site-search-group-title">Artists</div>
                    <ul className="header-site-search-list">
                      {results.artists.map((a) => (
                        <li key={a.id}>
                          <Link
                            to={`/porchfest/artists/${a.id}`}
                            className="header-site-search-hit"
                            onClick={onPick}
                          >
                            {a.thumbnailUrl || a.imageUrl ? (
                              <img
                                src={a.thumbnailUrl || a.imageUrl}
                                alt=""
                                className="header-site-search-thumb"
                                width="40"
                                height="40"
                                loading="lazy"
                              />
                            ) : (
                              <span className="header-site-search-thumb header-site-search-thumb--ph" aria-hidden />
                            )}
                            <span className="header-site-search-hit-text">
                              <span className="header-site-search-hit-name">{a.name}</span>
                              {a.location ? (
                                <span className="header-site-search-hit-meta">{a.location}</span>
                              ) : null}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {results.events.length > 0 ? (
                  <div className="header-site-search-group">
                    <div className="header-site-search-group-title">PorchFest</div>
                    <ul className="header-site-search-list">
                      {results.events.map((ev) => (
                        <li key={ev.id}>
                          <Link to="/porchfest" className="header-site-search-hit" onClick={onPick}>
                            <span className="header-site-search-thumb header-site-search-thumb--ev" aria-hidden>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="5" width="18" height="16" rx="2" />
                                <path d="M16 3v4M8 3v4M3 11h18" />
                              </svg>
                            </span>
                            <span className="header-site-search-hit-text">
                              <span className="header-site-search-hit-name">{ev.name}</span>
                              <span className="header-site-search-hit-meta">
                                {[ev.location?.city, ev.location?.state].filter(Boolean).join(', ')}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default HeaderSiteSearch
