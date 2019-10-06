import ScreenPoint from '../store/models/ScreenPoint'

export default function getScreenCoordinates (selector) {
  const el = document.querySelector(selector)

  if (el) {
    return ScreenPoint.from(el.getBoundingClientRect())
  }
  return new ScreenPoint(0, 0)
}
