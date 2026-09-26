import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-heading">Kuhlshit.com</h4>
            <p className="footer-text">
              Your premier destination for some really kuhl shit.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/closed-on-sundays">Closed on Sundays</Link></li>
              <li><Link to="/porch-talk">Porch Talk</Link></li>
              <li><Link to="/artists">Artists</Link></li>
              <li><Link to="/whats-kuhl">What&apos;s Kuhl</Link></li>
              <li><Link to="/vault">The Vault</Link></li>
              <li><Link to="/waitlist">Waitlist</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Connect</h4>
            <ul className="footer-links">
              <li><a href="https://www.instagram.com/porch_talk101/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.facebook.com/porchtalk101" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://youtube.com/@porchtalk_101" target="_blank" rel="noopener noreferrer">YouTube</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Kuhlshit.com. All rights reserved.</p>
          <p className="footer-dev-credit">
            Built by <a href="https://linktr.ee/sonofloke" target="_blank" rel="noopener noreferrer">Josh Jenkins</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
