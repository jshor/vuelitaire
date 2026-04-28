import { createSettings } from '@/models/Settings'
import { State } from '@/store/state'

export const createDeckState = (cards: Partial<State> = {
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

