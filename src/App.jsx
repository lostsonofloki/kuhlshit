import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Header from './components/Header'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar'
import LouieEasterEgg from './components/LouieEasterEgg'
import HomePage from './pages/HomePage'
import ClosedOnSundaysPage from './pages/ClosedOnSundaysPage'
import PorchFestPage from './pages/PorchFestPage'
import PorchTalkPage from './pages/PorchTalkPage'
import SearchPage from './pages/SearchPage'
import ArtistsPage from './pages/ArtistsPage'
import FeaturedArtistsPage from './pages/FeaturedArtistsPage'
import ArtistDetailPage from './pages/ArtistDetailPage'
import SpotCheckPage from './pages/SpotCheckPage'
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
            <Route path="/spotcheck" element={<SpotCheckPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <LouieEasterEgg />
      <Analytics />
      <SpeedInsights />
    </div>
  )
}

export default App
