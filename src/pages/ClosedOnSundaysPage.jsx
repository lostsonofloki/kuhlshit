import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ClosedOnSundays.css'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const PLAYLIST_ID = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID || 'PLzKakvgn9O5SVJcmGFIRc77zk8Asib1Ek';

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

  if (loading) {
    return (
      <div className="closed-on-sundays-page">
        <div className="page-header">
          <h1>Closed on Sundays</h1>
          <p>Podcast/YouTube featuring musicians playing 3-4 song sets</p>
        </div>
        <div className="loading">
          <p>Loading episodes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="closed-on-sundays-page">
        <div className="page-header">
          <h1>Closed on Sundays</h1>
          <p>Podcast/YouTube featuring musicians playing 3-4 song sets</p>
        </div>
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="closed-on-sundays-page">
      <div className="page-header">
        <h1>Closed on Sundays</h1>
        <p>Podcast/YouTube featuring musicians playing 3-4 song sets</p>
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
  )
}

export default ClosedOnSundaysPage
