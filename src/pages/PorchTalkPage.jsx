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
        <div className="search-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search for episodes..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="results-count">
        {filteredVideos.length} episode{filteredVideos.length !== 1 ? 's' : ''} found
      </div>

      {filteredVideos.length > 0 ? (
        <div className="videos-grid">
          {filteredVideos.map(video => (
            <div key={video.id} className="video-card">
              <a 
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="video-link"
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} loading="lazy" />
                  <div className="play-overlay">
                    <span className="play-icon">▶</span>
                  </div>
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p className="video-description">
                    {video.description.substring(0, 150)}
                    {video.description.length > 150 ? '...' : ''}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h3>No episodes found</h3>
          <p>Try a different search term</p>
        </div>
      )}

      <div className="back-link-container">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  )
}

export default PorchTalkPage
