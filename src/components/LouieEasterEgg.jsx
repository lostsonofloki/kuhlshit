import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'
import './LouieEasterEgg.css'

export default function LouieEasterEgg() {
  const [isVisible, setIsVisible] = useState(false)
  const [positionStyle, setPositionStyle] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // The "Dalmatians don't exist" modifier. 1 in 500 chance.
    // NOTE: Change 500 to 1 if you want to test it right now.
    const rarity = 500
    const roll = Math.floor(Math.random() * rarity)

    if (roll === 0) {
      // Array of mobile-safe edge positions (inline styles)
      const positions = [
        { top: '40px', right: 0, transform: 'translateX(-100%) rotate(90deg)' },
        { top: '40px', left: 0, transform: 'translateX(100%) rotate(-90deg)' },
        { top: '33%', right: 0, transform: 'translateY(-50%)' },
        { top: '33%', left: 0, transform: 'translateY(-50%) scaleX(-1)' },
        { bottom: '80px', right: 0, transform: 'translateY(50%)' },
      ]

      const randomPos = positions[Math.floor(Math.random() * positions.length)]
      setPositionStyle(randomPos)
      setIsVisible(true)
      trackEvent('louie_spotted', { path: location.pathname, rarity })
    } else {
      setIsVisible(false)
    }
  }, [location.pathname]) // Re-runs every time the route changes

  if (!isVisible) return null

  const handleClick = () => {
    trackEvent('louie_clicked', { path: location.pathname })
    navigate('/spotcheck')
  }

  return (
    <div
      onClick={handleClick}
      className="louie-easter-egg"
      style={positionStyle}
      title="Wait, is that a dalmatian?"
    >
      <img
        src="/resources/LouDog.svg"
        alt="Louie"
        className="louie-img"
      />
    </div>
  )
}
