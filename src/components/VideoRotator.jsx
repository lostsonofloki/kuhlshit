import { useState, useEffect, useCallback } from 'react'
import './VideoRotator.css'

const facebookUrls = [
  'https://www.facebook.com/reel/1834110677274435/',
  'https://www.facebook.com/reel/1625224325457257/',
  'https://www.facebook.com/reel/1599885821126882/',
]

function VideoRotator() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % facebookUrls.length)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + facebookUrls.length) % facebookUrls.length)
  }, [])

  // Auto-cycle every 60 seconds
  useEffect(() => {
    const timer = setInterval(handleNext, 60000)
    return () => clearInterval(timer)
  }, [handleNext])

  const encodedUrl = encodeURIComponent(facebookUrls[currentIndex])
  const iframeSrc = `https://www.facebook.com/plugins/video.php?height=315&href=${encodedUrl}&show_text=false&width=560&t=0`

  return (
    <div className="video-rotator">
      <h3 className="video-rotator-title">PorchFest 26 — See the Vibe</h3>

      <div className="video-rotator-wrapper">
        <div className="video-container">
          <iframe
            key={currentIndex}
            src={iframeSrc}
            className="video-iframe"
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>

        {/* Navigation Arrows */}
        <button
          className="video-nav-btn prev"
          onClick={handlePrev}
          aria-label="Previous video"
        >
          &#10094;
        </button>
        <button
          className="video-nav-btn next"
          onClick={handleNext}
          aria-label="Next video"
        >
          &#10095;
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="video-dots">
        {facebookUrls.map((_, index) => (
          <span
            key={index}
            className={`video-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default VideoRotator
