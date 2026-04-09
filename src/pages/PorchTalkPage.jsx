import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import './PorchTalkPage.css'

function PorchTalkPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredVideos, setFilteredVideos] = useState([])

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  const playlistId = 'PLzKakvgn9O5RUCNYT1QL0LQ_D_T3WSqdu'

  useEffect(() => {
    fetchVideos()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      setFilteredVideos(
        videos.filter(video =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query)
        )
      )
    } else {
      setFilteredVideos(videos)
    }
  }, [searchQuery, videos])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      let allItems = []
      let nextPageToken = null

      do {
        let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`
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

        if (nextPageToken) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } while (nextPageToken)

      const formattedVideos = allItems.map(item => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || 
                   item.snippet.thumbnails.medium?.url || 
                   item.snippet.thumbnails.default?.url || '',
        publishedAt: item.snippet.publishedAt
      }))

      setVideos(formattedVideos)
      setFilteredVideos(formattedVideos)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  if (loading) {
    return (
      <div className="porch-talk-page">
        <div className="loading">
          <h2>Loading episodes...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="porch-talk-page">
        <div className="error">
          <h2>Error Loading Episodes</h2>
          <p>{error}</p>
          <button onClick={fetchVideos} className="btn btn-primary">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="porch-talk-page">
      <div className="page-header">
        <h1>PorchTalk</h1>
        <p>Engaging conversations and community discussions</p>
      </div>

      <div className="search-section">
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="search-input"
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button type="submit" className="search-btn">Search</button>
          {searchQuery && (
            <button type="button" className="reset-btn" onClick={() => setSearchQuery('')}>
              Show All
            </button>
          )}
        </form>
      </div>

      <div className="results-count">
        {filteredVideos.length} of {videos.length} episode{videos.length !== 1 ? 's' : ''} shown
      </div>

      {filteredVideos.length === 0 ? (
        <div className="no-results">
          <p>No episodes found</p>
        </div>
      ) : (
        <div className="episodes-grid">
          {filteredVideos.map(video => (
            <div key={video.id} className="episode-card">
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="episode-link"
              >
                <div className="episode-thumbnail">
                  <img src={video.thumbnail} alt={video.title} loading="lazy" />
                  <div className="play-overlay">▶</div>
                </div>
              </a>
              <div className="episode-content">
                <h3>{video.title}</h3>
                <p className="episode-description">
                  {video.description.substring(0, 150)}
                  {video.description.length > 150 ? '...' : ''}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
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

export default PorchTalkPage
