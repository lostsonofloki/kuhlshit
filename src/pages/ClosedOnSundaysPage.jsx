import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import SEO from '../components/SEO'
import { CLOSED_ON_SUNDAYS_SEO } from '../constants/seoDefaults'
import './ClosedOnSundays.css'

const ARCHIVED_LIVE_EVENTS = (data.porchfest?.events || [])
  .filter(
    (e) =>
      typeof e.id === 'string' &&
      e.id.startsWith('closed-on-sundays-') &&
      typeof e.date === 'string' &&
      e.date.length > 0,
  )
  .sort((a, b) => new Date(b.date) - new Date(a.date))

const CLOSED_ON_SUNDAYS_INTRO = (
  <div className="page-static-intro">
    <p>
      <strong>Closed on Sundays</strong> is our listening-room performance series on Kuhlshit.com: artists play
      short sets straight to camera—often three or four songs—with a quiet, room-focused energy tied to
      the same scene as{' '}
      <Link to="/porchfest">PorchFest in Columbus, Mississippi</Link>. Episodes live on YouTube; this page
      lists every installment so you can search and jump in anywhere.
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

  const archiveNote =
    ARCHIVED_LIVE_EVENTS.length > 0 ? (
      <div className="page-header-archive-list">
        {ARCHIVED_LIVE_EVENTS.filter((e) => e.description).map((e) => (
          <p key={e.id} className="page-header-archive">
            {e.description}
          </p>
        ))}
      </div>
    ) : null

  if (loading) {
    return (
      <>
      <SEO {...CLOSED_ON_SUNDAYS_SEO} />
      <div className="closed-on-sundays-page">
        {CLOSED_ON_SUNDAYS_INTRO}
        <div className="page-header">
          <h1>Closed on Sundays</h1>
          <p>Listening-room performances — short sets to camera</p>
          {archiveNote}
        </div>
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
          <p>Listening-room performances — short sets to camera</p>
          {archiveNote}
        </div>
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
        <p>Listening-room performances — short sets to camera</p>
        {archiveNote}
      </div>

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
