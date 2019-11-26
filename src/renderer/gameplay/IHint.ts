import ICard from '../types/interfaces/ICard'
import { DeckState } from '../store/modules/deck'

export default interface IHint {
  (allCards: ICard[], playableCards: ICard[], deckState: DeckState, ignoreRank?: boolean): string[][]
}
