import { BoundingBox } from "./BoundingBox"
import { Card } from "@/types/Card"

export type Hotspot = {
  card: Card
  highlightSpot: BoundingBox
  dropSpot: BoundingBox
}
