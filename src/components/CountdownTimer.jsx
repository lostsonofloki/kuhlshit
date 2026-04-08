import { useState, useEffect } from 'react'
import './CountdownTimer.css'

// Target: Friday, April 17, 2026 at 4:00 PM CDT (UTC-5)
const TARGET_DATE = new Date('2026-04-17T16:00:00-05:00').getTime()

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(null)
  const [status, setStatus] = useState('counting') // 'counting' | 'live' | 'ended'

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now()
      const difference = TARGET_DATE - now

      if (difference <= 0) {
        // Check if festival is still ongoing (end date: Apr 19, 2026 11:00 PM CDT)
        const endDate = new Date('2026-04-19T23:00:00-05:00').getTime()
        if (now < endDate) {
          setStatus('live')
        } else {
          setStatus('ended')
        }
        setTimeLeft(null)
        return
      }

      setStatus('counting')
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  if (status === 'live') {
    return (
      <div className="countdown-timer live">
        <span className="countdown-label">🎸</span>
        <span className="countdown-live-text">DOORS ARE OPEN!</span>
      </div>
    )
  }

  if (status === 'ended') {
    return (
      <div className="countdown-timer ended">
        <span className="countdown-ended-text">PorchFest 2026 has ended. See you next year!</span>
      </div>
    )
  }

  if (!timeLeft) return null

  return (
    <div className="countdown-timer">
      <span className="countdown-label">PorchFest 26 starts in</span>
      <div className="countdown-units">
        <div className="countdown-unit">
          <span className="countdown-value">{timeLeft.days}</span>
          <span className="countdown-unit-label">Days</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{timeLeft.hours}</span>
          <span className="countdown-unit-label">Hrs</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{timeLeft.minutes}</span>
          <span className="countdown-unit-label">Min</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{timeLeft.seconds}</span>
          <span className="countdown-unit-label">Sec</span>
        </div>
      </div>
    </div>
  )
}

export default CountdownTimer
