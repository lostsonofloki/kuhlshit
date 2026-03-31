import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ClosedOnSundaysPage from './pages/ClosedOnSundaysPage'
import PorchFestPage from './pages/PorchFestPage'
import PorchTalkPage from './pages/PorchTalkPage'
import SearchPage from './pages/SearchPage'
import FeaturedArtistsPage from './pages/FeaturedArtistsPage'
import ArtistDetailPage from './pages/ArtistDetailPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/closed-on-sundays" element={<ClosedOnSundaysPage />} />
          <Route path="/porchfest" element={<PorchFestPage />} />
          <Route path="/porchfest/artists" element={<FeaturedArtistsPage />} />
          <Route path="/porchfest/artists/:artistId" element={<ArtistDetailPage />} />
          <Route path="/porch-talk" element={<PorchTalkPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
