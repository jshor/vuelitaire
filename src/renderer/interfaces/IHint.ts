import ICard from './ICard'
import IDeckState from './IDeckState'

export default interface IHint {
  (allCards: ICard[], playableCards: ICard[], deckState: IDeckState, ignoreRank?: boolean): string[][]
}
