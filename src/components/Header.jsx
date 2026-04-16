import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'

function Header({ isMySpaceMode = false, setIsMySpaceMode = () => {} }) {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)
  const navigate = useNavigate()
  const Maps = navigate

  useEffect(() => {
    if (logoClickCount >= 5) {
      setLogoClickCount(0)
      Maps('/retro')
    }
  }, [logoClickCount, Maps])

  const navLinks = [
    { path: '/artists', label: 'Artists' },
    { path: '/closed-on-sundays', label: 'Closed on Sundays' },
    { path: '/porchfest', label: 'PorchFest' },
    { path: '/porch-talk', label: 'PorchTalk' },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
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
            <Link to="/search" className="header-search-btn" onClick={closeMenu}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </Link>

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
      <nav className={`main-nav ${isMenuOpen ? 'menu-open' : ''}`}>
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
