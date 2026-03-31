import './SearchBar.css'

function SearchBar({ onSearch, placeholder = "Search artists, location..." }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    onSearch && onSearch(query)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          name="search"
          className="search-input"
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
      <button type="submit" className="search-submit">
        Search
      </button>
    </form>
  )
}

export default SearchBar
