import { createSettings } from '@/models/Settings'
import { State } from '@/store/state'

interface DeckCards {
  foundations?: Record<string, any>
  tableau?: Record<string, any>
  regular?: Record<string, any>
  unrevealedCount?: number
}

export const createDeckState = (cards: DeckCards = {
  foundations: {},
  tableau: {},
  regular: {},
  unrevealedCount: 52
}): State => ({
  cards: cards.regular ?? {},
  tableau: cards.tableau ?? {},
  foundations: cards.foundations ?? {},
  stock: [],
  waste: [],
  settings: createSettings(),
} as unknown as State)

