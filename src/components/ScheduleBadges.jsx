import './ScheduleBadges.css'

const BRAND_GOLD = '#E08E36'

/**
 * Industrial LIVE / NEXT UP — only render when status is set (no placeholders when times are TBA).
 * @param {{ status: 'live' | 'next' | null | undefined, className?: string }} props
 */
export function ScheduleBadges({ status, className = '' }) {
  if (status === 'live') {
    return (
      <span className={`schedule-badges schedule-badges--live ${className}`.trim()} style={{ '--badge-gold': BRAND_GOLD }}>
        <span className="schedule-badges__dot schedule-badges__dot--pulse" aria-hidden />
        <span className="schedule-badges__label">LIVE</span>
      </span>
    )
  }
  if (status === 'next') {
    return (
      <span className={`schedule-badges schedule-badges--next ${className}`.trim()} style={{ '--badge-gold': BRAND_GOLD }}>
        <span className="schedule-badges__label">NEXT UP</span>
      </span>
    )
  }
  return null
}

export default ScheduleBadges
