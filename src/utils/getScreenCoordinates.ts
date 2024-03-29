import ScreenPoint from '@/models/ScreenPoint'

/**
 * Returns the ScreenPoint of the element coordinates, or the origin if not found.
 *
 * @param {string} selector - DOM selector for the element
 * @returns {ScreenPoint}
 */
export default function getScreenCoordinates (selector: string): ScreenPoint {
  const el = document.querySelector(selector)

  if (el) {
    return ScreenPoint.from(el.getBoundingClientRect())
  }
  return new ScreenPoint(0, 0)
}
