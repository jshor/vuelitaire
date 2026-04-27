import { Card } from "@/types/Card"
import type { IRule } from '@/interfaces/IRule'

export interface ICard {
  type: 'Card' | 'FoundationSpace' | 'LaneSpace' | 'DealSpace'

  id: string

  child: Card | undefined

  parent: ICard | undefined

  promoted: boolean

  hasError: boolean

  revealed: boolean

  animationIndex: number

  suit: string

  rank: number

  rules: IRule[]

  index: number // TODO: remove?

  canAcceptCard: (this: ICard, card?: ICard) => boolean
}
