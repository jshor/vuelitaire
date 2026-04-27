import { ICard } from './ICard'
import { State } from '../store/state'

export interface IHint {
  (allCards: ICard[], playableCards: ICard[], gameState: State, ignoreRank?: boolean): string[][]
}
