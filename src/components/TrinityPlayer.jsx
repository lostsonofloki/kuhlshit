import { useState } from 'react'
import './TrinityPlayer.css'

function TrinityPlayer({ still }) {
  const [activeSegment, setActiveSegment] = useState('electricSet')
  
  const segments = [
    { 
      key: 'electricSet', 
      label: 'Electric Set', 
      icon: '⚡',
      video: still?.electricSet 
    },
    { 
      key: 'interview', 
      label: 'Interview', 
      icon: '🎙️',
      video: still?.interview 
    },
    { 
      key: 'acousticCloser', 
      label: 'Acoustic Closer', 
      icon: '🎸',
      video: still?.acousticCloser 
    }
  ]

  const currentVideo = segments.find(s => s.key === activeSegment)?.video

  return (
    <div className="trinity-player">
      <div className="trinity-header">
        <h3>The Still Session</h3>
        <p className="trinity-subtitle">Three segments. One complete story.</p>
      </div>

      <div className="trinity-main">
        <div className="trinity-video">
          {currentVideo ? (
            <div className="video-embed">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="video-placeholder">
              <p>Video not available</p>
            </div>
          )}
          
          {currentVideo && (
            <div className="video-info">
              <h4>{currentVideo.title}</h4>
              {currentVideo.duration && (
                <span className="video-duration">{currentVideo.duration}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="trinity-segments">
        {segments.map((segment) => (
          <button
            key={segment.key}
            className={`segment-btn ${activeSegment === segment.key ? 'active' : ''}`}
            onClick={() => setActiveSegment(segment.key)}
          >
            <span className="segment-icon">{segment.icon}</span>
            <span className="segment-label">{segment.label}</span>
            {segment.video && (
              <span className="segment-duration">{segment.video.duration}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TrinityPlayer
