import { useEffect } from 'react'
import './GigTracker.css'

function GigTracker({ artistSlug }) {
  useEffect(() => {
    if (!artistSlug) return

    if (!window.Bandsintown) {
      const script = document.createElement('script')
      script.src = 'https://widget.bandsintown.com/main.min.js'
      script.async = true
      document.body.appendChild(script)
    } else if (window.Bandsintown.render) {
      setTimeout(() => {
        window.Bandsintown.render()
      }, 100)
    }
  }, [artistSlug])

  if (!artistSlug) return null

  return (
    <div className="gig-tracker" key={artistSlug}>
      <h3 className="gig-tracker-title">Live Dates</h3>
      <a
        className="bit-widget-initializer"
        data-artist-name={artistSlug}
        data-background-color="transparent"
        data-text-color="#c9b896"
        data-link-color="#d48c29"
        data-button-text-color="#d48c29"
        data-button-background-color="transparent"
        data-button-border-color="#d48c29"
        data-button-border-width="1px"
        data-button-border-radius="4px"
        data-separator-color="rgba(255,255,255,0.1)"
        data-display-limit="5"
        data-display-local-dates="false"
        data-display-past-dates="false"
        data-display-play-my-city="false"
        data-font="inherit"
      ></a>
    </div>
  )
}

export default GigTracker
