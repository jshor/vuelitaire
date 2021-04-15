import ICardsState from '@/interfaces/ICardsState'
import IDeckState from '@/interfaces/IDeckState'

const generateState = (cards: ICardsState): IDeckState => ({
  cards,
  move: null,
  waste: [],
  stock: [],
  dealt: [],
  dealCount: 1
})

export default generateState
