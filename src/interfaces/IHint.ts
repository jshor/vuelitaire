import { State } from '../store/state'
import { Card } from '@/types/Card'

export interface IHint {
  (state: State, playableCards: Card[], ignoreRank?: boolean): string[][]
}
