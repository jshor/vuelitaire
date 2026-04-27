import { ScreenPoint } from '@/models/ScreenPoint'

export default function getScreenCoordinates (selector: string): ScreenPoint {
  const element = document.querySelector(selector)

  if (!element) {
    return new ScreenPoint(0, 0)
  }

  const rect = element.getBoundingClientRect()
  return new ScreenPoint(rect.left, rect.top)
}
