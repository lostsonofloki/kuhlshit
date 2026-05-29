import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import data from "../data/data.json";
import SEO from "../components/SEO";
import { ARTISTS_INDEX_SEO } from "../constants/seoDefaults";
import SmartImage from "../components/SmartImage";
import {
  CREATOR_TAB_ALL,
  CREATOR_TABS,
  artistMatchesCreatorTab,
  countArtistsInCreatorTab,
} from "../utils/creatorCategories";
import "./ArtistsPage.css";

function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(CREATOR_TAB_ALL);
  const [filteredArtists, setFilteredArtists] = useState([]);

  useEffect(() => {
    const allArtists = data.artists || [];
    setArtists(allArtists);
  }, []);

  const visibleTabs = useMemo(
    () =>
      CREATOR_TABS.filter(
        (tab) =>
          tab.id === CREATOR_TAB_ALL ||
          countArtistsInCreatorTab(artists, tab.id) > 0,
      ),
    [artists],
  );

  useEffect(() => {
    let list = artists.filter((artist) =>
      artistMatchesCreatorTab(artist, activeTab),
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (artist) =>
          artist.name.toLowerCase().includes(query) ||
          artist.location?.toLowerCase().includes(query) ||
          artist.genre?.toLowerCase().includes(query),
      );
    }

    setFilteredArtists(list);
  }, [searchQuery, artists, activeTab]);

  useEffect(() => {
    if (
      activeTab !== CREATOR_TAB_ALL &&
      !visibleTabs.some((t) => t.id === activeTab)
    ) {
      setActiveTab(CREATOR_TAB_ALL);
    }
  }, [activeTab, visibleTabs]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const activeTabLabel =
    CREATOR_TABS.find((t) => t.id === activeTab)?.label || "Creators";
  const resultsNoun =
    activeTab === CREATOR_TAB_ALL
      ? "creators"
      : activeTabLabel.toLowerCase();

  return (
    <>
      <SEO {...ARTISTS_INDEX_SEO} />
      <div className="artists-page">
        <div className="page-header">
          <h1>Creators</h1>
          <p>
            Musicians, painters, poets, and writers building homes on
            kuhlshit.com
          </p>
        </div>

        <div
          className="creator-tab-filter"
          role="tablist"
          aria-label="Filter by creator type"
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`creator-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="search-section">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              name="search"
              className="search-input"
              placeholder="Search by name, location, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>

        <div className="results-info">
          <p>
            {filteredArtists.length} {resultsNoun} found
          </p>
          {searchQuery && (
            <button type="button" className="clear-btn" onClick={clearSearch}>
              Clear Search
            </button>
          )}
        </div>

        {filteredArtists.length > 0 ? (
          <div className="artists-grid">
            {filteredArtists.map((artist) => (
              <Link
                key={artist.id}
                to={`/artists/${artist.id}`}
                className="artist-card"
              >
                <div className="artist-card-image">
                  <SmartImage
                    src={artist.imageUrl || "/resources/placeholder-artist.svg"}
                    alt={artist.name}
                    width="400"
                    height="400"
                    className={
                      artist.cardImageFit === "contain"
                        ? "artist-image-fit-contain"
                        : ""
                    }
                    onError={(e) => {
                      e.target.src = "/resources/placeholder-artist.svg";
                    }}
                  />
                  <div className="artist-card-overlay">
                    <span className="view-profile">View Profile →</span>
                  </div>
                </div>
                <div className="artist-card-content">
                  <h3 className="artist-name">{artist.name}</h3>
                  {artist.location && (
                    <p className="artist-location">{artist.location}</p>
                  )}
                  {artist.genre && (
                    <p className="artist-genre">{artist.genre}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-artists">
            <h3>No creators found</h3>
            <p>
              {searchQuery
                ? "Try adjusting your search"
                : `No ${resultsNoun} in the roster yet.`}
            </p>
            {(searchQuery || activeTab !== CREATOR_TAB_ALL) && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  clearSearch();
                  setActiveTab(CREATOR_TAB_ALL);
                }}
              >
                Show all creators
              </button>
            )}
          </div>
        )}

        <div className="back-link-container">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default ArtistsPage;
