import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Header from './components/Header'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar'
import LouieEasterEgg from './components/LouieEasterEgg'
import './App.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const ClosedOnSundaysPage = lazy(() => import('./pages/ClosedOnSundaysPage'))
const PorchFestPage = lazy(() => import('./pages/PorchFestPage'))
const PorchTalkPage = lazy(() => import('./pages/PorchTalkPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const ArtistsPage = lazy(() => import('./pages/ArtistsPage'))
const FeaturedArtistsPage = lazy(() => import('./pages/FeaturedArtistsPage'))
const ArtistDetailPage = lazy(() => import('./pages/ArtistDetailPage'))
const SpotCheckPage = lazy(() => import('./pages/SpotCheckPage'))
const VaultPage = lazy(() => import('./pages/VaultPage'))
const WaitlistPage = lazy(() => import('./pages/WaitlistPage'))

/** Vercel injects /_vercel/* scripts only on their platform; skip locally to avoid 404 console noise. */
function VercelMetrics() {
  if (typeof window === 'undefined') return null
  const h = window.location.hostname
  if (h === 'localhost' || h === '127.0.0.1') return null
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

function App() {
  return (
    <div className="app">
      <AnnouncementBar />
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          <Suspense fallback={null}>
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
              <Route path="/vault" element={<VaultPage />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <Footer />
      <LouieEasterEgg />
      <VercelMetrics />
    </div>
  )
}

export default App
