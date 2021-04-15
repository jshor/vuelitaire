// import Pair from '@/models/Pair'
import Pair from '@/models/Pair'
import ICard from './ICard'
import ICardsState from './ICardsState'

export default interface IDeckState {
  cards: ICardsState
  move: Pair,
  stock: ICard[] // cards in the stock pile
  waste: ICard[] // the pile of cards dealt
  dealt: ICard[] // the last `dealCount` (or fewer) cards dealt
  dealCount: number // number of cards to deal at a time
}
