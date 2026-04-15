import { useState, useEffect } from 'react'

/** Updates periodically so LIVE / NEXT UP can refresh without a full page reload. */
export function useFestivalClock(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
