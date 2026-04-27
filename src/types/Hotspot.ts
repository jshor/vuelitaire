import { BoundingBox } from "./BoundingBox"
import { ICard } from "@/interfaces/ICard"

export type Hotspot = {
  card: ICard
  highlightSpot: BoundingBox
  dropSpot: BoundingBox
}
