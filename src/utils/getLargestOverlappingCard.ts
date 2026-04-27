import { BoundingBox } from "@/types/BoundingBox"
import { Hotspot } from "@/types/Hotspot"

export function getLargestOverlappingCard (
  /** The bounding box of the area to compare against. */
  currentBoundingBox: BoundingBox,
  /** List of hotspots to compare with. */
  hotspots: Hotspot[],
  /** The currently-active geometric area representing the  */
  currentHotspot?: Hotspot
): Hotspot | undefined {
  let largestOverlappingArea = 0
  let nextHotspot = { ...currentHotspot } as Hotspot

  hotspots
    .forEach(({ highlightSpot, dropSpot, card }) => {
      // card.isHighlighted = false

      if (hasIntersection(highlightSpot, currentBoundingBox)) {
        const overlap = getOverlap(highlightSpot, currentBoundingBox)

        if (overlap > largestOverlappingArea) {
          if (nextHotspot) {
            // nextHotspot.card.isHighlighted = false
          }

          nextHotspot = { card, highlightSpot, dropSpot } as Hotspot
          largestOverlappingArea = overlap
          // card.isHighlighted = true
        }
      }
    })

  if (largestOverlappingArea === 0) {
    return undefined
  }

  return nextHotspot
}

function hasIntersection (a: BoundingBox, b: BoundingBox): boolean {
  if (a.left >= b.right || b.left >= a.right) {
    // one rect is on left side of other
    return false
  }

  if (a.top >= b.bottom || b.top >= a.bottom) {
    // one rect is above other
    return false
  }

  return true
}

function getOverlap (a: BoundingBox, b: BoundingBox): number {
  const xOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
  const yOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))

  return xOverlap * yOverlap
}
