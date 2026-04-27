import { ICard } from '@/interfaces/ICard'
import { ICardsMap } from '@/interfaces/ICardsMap'
import { State } from '@/store/state'

export const generateDeckState = (regular: ICardsMap<ICard>): State => ({
  cards: regular,
  tableau: {},
  foundations: {},
  waste: [],
  stock: [],
} as unknown as State)

