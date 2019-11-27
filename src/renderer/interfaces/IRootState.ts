import IAnimationState from './IAnimationState'
import ICard from './ICard'
import IDeckState from './IDeckState'
import IHintsState from './IHintsState'

export default interface IRootState {
  gameId: string
  revertibleStates: IDeckState[]
  selectedCard: ICard
  deck: IDeckState
  animation: IAnimationState
  hints: IHintsState
}
