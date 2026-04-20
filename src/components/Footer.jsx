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
              <li><a href="/closed-on-sundays">Closed on Sundays</a></li>
              <li><a href="/porch-talk">PorchTalk</a></li>
              <li><a href="/vault">The Vault</a></li>
              <li><a href="/waitlist">Waitlist</a></li>
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
