import { State } from '../store/state'
import { Card } from '@/types/Card'

export interface IHint {
  (allCards: Card[], playableCards: Card[], deckState: State, ignoreRank?: boolean): string[][]
}
