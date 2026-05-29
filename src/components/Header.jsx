import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import HeaderSiteSearch from './HeaderSiteSearch'
import './Header.css'

function Header() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)
  const navigate = useNavigate()

  const navLinks = [
    { path: '/closed-on-sundays', label: 'Closed on Sundays' },
    { path: '/porch-talk', label: 'Porch Talk' },
    { path: '/artists', label: 'Artists' },
    { path: '/whats-kuhl', label: "What's Kuhl" },
    { path: '/vault', label: 'The Vault' },
  ]

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    if (logoClickCount >= 5) {
      setLogoClickCount(0)
      navigate('/retro')
    }
  }, [logoClickCount, navigate])

  useEffect(() => {
    closeMenu()
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', isMenuOpen)
    return () => document.body.classList.remove('nav-menu-open')
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogoClick = () => {
    closeMenu()
    setLogoClickCount((prevCount) => prevCount + 1)
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Left: Logo */}
          <Link to="/" className="logo" onClick={handleLogoClick}>
            <span className="logo-text">Kuhlshit.com</span>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="nav-list">
            {navLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </nav>

          {/* Right: Search + Hamburger */}
          <div className="header-controls">
            <HeaderSiteSearch onNavigate={closeMenu} />

            <button
              className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay — OUTSIDE header to avoid stacking context clipping */}
      <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      {/* Mobile Navigation — OUTSIDE header */}
      <nav
        className={`main-nav ${isMenuOpen ? 'menu-open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <ul className="mobile-nav-list">
          {navLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default Header
