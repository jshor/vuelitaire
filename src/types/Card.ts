import type { IRule } from '@/interfaces/IRule'

export type Card = {
  type: 'Card' | 'FoundationSpace' | 'LaneSpace' | 'DealSpace'

  id: string

  child: Card | undefined

  parent: Card | undefined

  promoted: boolean

  revealed: boolean

  suit: string

  rank: number

  rules: IRule[]

  canAcceptCard: (this: Card, card?: Card) => boolean
}
