import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import SEO from '../components/SEO'
import { CLOSED_ON_SUNDAYS_SEO } from '../constants/seoDefaults'
import {
  formatCosHubDateShort,
  getPastClosedOnSundayHubEventsSorted,
  getUpcomingCosHubRowsForDisplay,
} from '../lib/closedOnSundayHubEvents'
import './ClosedOnSundays.css'

function cosSessionShortTitle(name) {
  if (typeof name !== 'string') return 'Session'
  return name.replace(/^Closed on Sunday:\s*/i, '').trim() || name
}

function PastCosSessionsArchive() {
  const past = useMemo(
    () => getPastClosedOnSundayHubEventsSorted(data.porchfest?.events || [], new Date()),
    [],
  )

  if (past.length === 0) return null

  return (
    <div className="page-header-archive-list" aria-label="Past sessions at Al's">
      <p className="page-header-archive-intro">
        Past shoots at Al&apos;s for this series (newest first). Upcoming dates are in the list below.
      </p>
      <ul className="page-header-archive-items">
        {past.map((e) => {
          const to = e.vaultLinks?.secondary?.to
          const label = cosSessionShortTitle(e.name)
          return (
            <li key={e.id} className="page-header-archive-item">
              <span className="page-header-archive-date">{formatCosHubDateShort(e.date)}</span>
              <span className="page-header-archive-sep"> — </span>
              {to ? (
                <Link to={to} className="page-header-archive-link">
                  {label}
                </Link>
              ) : (
                <span>{label}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function UpcomingCosShowsSection() {
  const rows = useMemo(
    () =>
      getUpcomingCosHubRowsForDisplay(data.porchfest?.events || [], data.artists || [], {
        now: new Date(),
      }),
    [],
  )

  if (rows.length === 0) return null

  return (
    <section className="cos-upcoming-section" aria-labelledby="cos-upcoming-heading">
      <h2 id="cos-upcoming-heading" className="cos-upcoming-heading">
        Upcoming shows
      </h2>
      <p className="cos-upcoming-lead">
        Listening-room sets at Al&apos;s Spirits &amp; Music (Reform, AL), filmed for this series. Dates are
        Central Time unless noted. If you&apos;re coming out in person: bring a chair.
      </p>
      <ul className="cos-upcoming-list">
        {rows.map(({ event: e, dateLabel, title, whenExtra, profileTo, artistName }) => (
          <li key={e.id} className="cos-upcoming-item">
            <div className="cos-upcoming-item-main">
              <p className="cos-upcoming-date">{dateLabel}</p>
              <h3 className="cos-upcoming-title">
                {profileTo && artistName ? (
                  <Link to={profileTo} className="cos-upcoming-title-link">
                    {artistName}
                  </Link>
                ) : (
                  title
                )}
              </h3>
              {whenExtra ? <p className="cos-upcoming-when">{whenExtra}</p> : null}
            </div>
            {profileTo ? (
              <Link to={profileTo} className="btn btn-secondary cos-upcoming-cta">
                {artistName ? `${artistName} profile` : 'Artist profile'}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

const CLOSED_ON_SUNDAYS_INTRO = (
  <div className="page-static-intro">
    <p>
      <strong>Closed on Sundays</strong> — listening-room performances: short sets to camera for our YouTube
      series, with the same room-focused spirit as{' '}
      <Link to="/porchfest">PorchFest in Columbus, Mississippi</Link>. Episodes live on YouTube; upcoming dates
      at Al&apos;s are listed below, then the full archive you can search. In person at Al&apos;s it&apos;s a
      small listening lounge—<strong>bring a chair</strong>.
    </p>
    <p className="page-static-intro-links">
      <Link to="/porch-talk">Porch Talk interviews</Link>
      {' · '}
      <Link to="/porchfest">PorchFest</Link>
      {' · '}
      <Link to="/">Home</Link>
    </p>
  </div>
)

// Check for VITE_ prefix (Vite standard) or plain name (Vercel import)
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || import.meta.env.YOUTUBE_API_KEY || '';
const PLAYLIST_ID = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID || import.meta.env.YOUTUBE_PLAYLIST_ID || 'PLzKakvgn9O5SVJcmGFIRc77zk8Asib1Ek';

function ClosedOnSundaysPage() {
  const [episodes, setEpisodes] = useState([])
  const [filteredEpisodes, setFilteredEpisodes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEpisodes()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const filtered = episodes.filter(ep =>
        ep.title.toLowerCase().includes(query) ||
        ep.description.toLowerCase().includes(query)
      )
      setFilteredEpisodes(filtered)
    } else {
      setFilteredEpisodes(episodes)
    }
  }, [searchQuery, episodes])

  async function fetchEpisodes() {
    try {
      setLoading(true)
      let allItems = []
      let nextPageToken = null

      do {
        let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=50&key=${YOUTUBE_API_KEY}`
        if (nextPageToken) {
          url += `&pageToken=${nextPageToken}`
        }

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        if (data.items) {
          allItems = allItems.concat(data.items)
        }
        nextPageToken = data.nextPageToken
      } while (nextPageToken)

      const episodesData = allItems.map(item => {
        const video = item.snippet
        const videoId = video.resourceId.videoId
        const thumbnails = video.thumbnails

        return {
          id: videoId,
          title: video.title,
          description: video.description,
          thumbnail: thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || '',
          videoId: videoId,
          publishedAt: video.publishedAt
        }
      })

      setEpisodes(episodesData)
      setFilteredEpisodes(episodesData)
      setError(null)
    } catch (err) {
      setError('Failed to load episodes. Try again later.')
      console.error('Error fetching episodes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    setSearchQuery(query)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const pastSessionsBlock = <PastCosSessionsArchive />

  if (loading) {
    return (
      <>
      <SEO {...CLOSED_ON_SUNDAYS_SEO} />
      <div className="closed-on-sundays-page">
        {CLOSED_ON_SUNDAYS_INTRO}
        <div className="page-header">
          <h1>Closed on Sundays</h1>
          <p className="page-header-tagline">
            Listening-room performances — short sets to camera. (Tell people to bring a chair.)
          </p>
          {pastSessionsBlock}
        </div>
        <UpcomingCosShowsSection />
        <div className="loading">
          <p>Loading episodes...</p>
        </div>
      </div>
      </>
    )
  }

  if (error) {
    return (
      <>
      <SEO {...CLOSED_ON_SUNDAYS_SEO} />
      <div className="closed-on-sundays-page">
        {CLOSED_ON_SUNDAYS_INTRO}
        <div className="page-header">
          <h1>Closed on Sundays</h1>
          <p className="page-header-tagline">
            Listening-room performances — short sets to camera. (Tell people to bring a chair.)
          </p>
          {pastSessionsBlock}
        </div>
        <UpcomingCosShowsSection />
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
    <SEO {...CLOSED_ON_SUNDAYS_SEO} />
    <div className="closed-on-sundays-page">
      {CLOSED_ON_SUNDAYS_INTRO}
      <div className="page-header">
        <h1>Closed on Sundays</h1>
        <p className="page-header-tagline">
          Listening-room performances — short sets to camera. (Tell people to bring a chair.)
        </p>
        {pastSessionsBlock}
      </div>

      <UpcomingCosShowsSection />

      <div className="search-section">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            className="search-input"
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
          {searchQuery && (
            <button type="button" className="reset-btn" onClick={clearSearch}>
              Show All
            </button>
          )}
        </form>
      </div>

      <div className="results-count">
        {filteredEpisodes.length} of {episodes.length} episode{episodes.length !== 1 ? 's' : ''} shown
      </div>

      {filteredEpisodes.length === 0 ? (
        <div className="no-results">
          <p>No episodes found</p>
        </div>
      ) : (
        <div className="episodes-grid">
          {filteredEpisodes.map(episode => (
            <div key={episode.id} className="episode-card">
              <a
                href={`https://www.youtube.com/watch?v=${episode.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="episode-link"
              >
                <div className="episode-thumbnail">
                  <img src={episode.thumbnail} alt={episode.title} />
                  <div className="play-overlay">▶</div>
                </div>
              </a>
              <div className="episode-content">
                <h3>{episode.title}</h3>
                <p className="episode-description">
                  {episode.description.substring(0, 150)}
                  {episode.description.length > 150 ? '...' : ''}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${episode.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-btn"
                >
                  Watch on YouTube →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
    </>
  )
}

export default ClosedOnSundaysPage
