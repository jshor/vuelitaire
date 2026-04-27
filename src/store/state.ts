import { ICard } from "@/interfaces/ICard"
import { IHint } from "@/interfaces/IHint"
import { createDealSpace } from "@/models/DealSpace"
import { createSettings } from "@/models/Settings"
import { Card } from "@/types/Card"
import { Hotspot } from "@/types/Hotspot"
import { Move } from "@/types/Move"
import { Settings } from "@/types/Settings"
import { Teleportation } from "@/types/Teleportation"

export type State = {
  stock: Card[] // all cards in the stock pile
  waste: Card[] // all cards in the waste pile
  cards: Record<string, ICard> // all cards in the entire game
  tableau: Record<string, ICard> // all cards in the tableau
  foundations: Record<string, ICard> // all cards in the foundations piles
  hotspots: Hotspot[]
  teleportation?: Teleportation
  draggedCardId?: string // the ID of the actively-dragged card
  hoveredCardId?: string // the ID of the card whose actively-dragged card is hovering over.
  selectedCardId?: string // the ID of the card that was selected by the user
  errorCardId?: string // the ID of the card with an error
  dealSpace: ICard
  isAutoplaying: boolean
  isUndoing: boolean
  undoStack: Move[]
  settings: Settings
  points: number
  hints: string[][]
  currentHintIndex: number
}

export function state (): State {
  return {
    stock: [],
    waste: [],
    cards: {},
    tableau: {},
    foundations: {},
    hotspots: [],
    teleportation: undefined,
    selectedCardId: undefined,
    draggedCardId: undefined,
    errorCardId: undefined,
    dealSpace: createDealSpace(),
    isAutoplaying: false,
    isUndoing: false,
    undoStack: [],
    settings: createSettings(),
    points: 0,
    hints: [],
    currentHintIndex: -1
  }
}
