import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import data from '../data/data.json'
import ArtistCard from '../components/ArtistCard'
import SearchBar from '../components/SearchBar'
import './ArtistsPage.css'

function ArtistsPage() {
  const [artists, setArtists] = useState([])
  const [filteredArtists, setFilteredArtists] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setArtists(data.artists)
    setFilteredArtists(data.artists)
  }, [])

  useEffect(() => {
    let filtered = artists

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(artist =>
        artist.name.toLowerCase().includes(query) ||
        artist.location.toLowerCase().includes(query)
      )
    }

    setFilteredArtists(filtered)
  }, [searchQuery, artists])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <div className="artists-page">
      <div className="page-header">
        <h1>Artists</h1>
        <p>Discover talented musicians from around the world</p>
      </div>

      <div className="search-section">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="results-info">
        <p>{filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''} found</p>
      </div>

      {filteredArtists.length > 0 ? (
        <div className="artists-grid">
          {filteredArtists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h3>No artists found</h3>
          <p>Try adjusting your search</p>
          <button onClick={() => setSearchQuery('')} className="btn btn-primary">
            Clear Search
          </button>
        </div>
      )}
    </div>
  )
}

export default ArtistsPage
