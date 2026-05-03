import { State } from '../store/state'
import { ICard } from './ICard'

export interface IHint {
  (state: State, playableCards: ICard[], ignoreRank?: boolean): string[][]
}
