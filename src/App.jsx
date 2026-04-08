import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar'
import HomePage from './pages/HomePage'
import ClosedOnSundaysPage from './pages/ClosedOnSundaysPage'
import PorchFestPage from './pages/PorchFestPage'
import PorchTalkPage from './pages/PorchTalkPage'
import SearchPage from './pages/SearchPage'
import ArtistsPage from './pages/ArtistsPage'
import FeaturedArtistsPage from './pages/FeaturedArtistsPage'
import ArtistDetailPage from './pages/ArtistDetailPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <AnnouncementBar />
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/closed-on-sundays" element={<ClosedOnSundaysPage />} />
            <Route path="/porchfest" element={<PorchFestPage />} />
            <Route path="/porchfest/artists" element={<FeaturedArtistsPage />} />
            <Route path="/porchfest/artists/:artistId" element={<ArtistDetailPage />} />
            <Route path="/porch-talk" element={<PorchTalkPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
