import data from '../data/data.json'
import { getNextClosedOnSundayHubEvent } from './closedOnSundayHubEvents.js'

/**
 * Homepage Closed on Sundays live promo: visible when there is at least one
 * upcoming `closed-on-sundays-*` hub row in `data.json` (Chicago calendar date).
 */
export function isClosedOnSundayLivePromoActive(now = new Date()) {
  return getNextClosedOnSundayHubEvent(data.porchfest?.events || [], now) != null
}
