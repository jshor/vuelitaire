import hasAlternatingColorBeforePromotion from '@/gameplay/rules/hasAlternatingColorBeforePromotion'
import hasSameSuitAfterPromotion from '@/gameplay/rules/hasSameSuitAfterPromotion'
import isBuildable from '@/gameplay/rules/isBuildable'
import isSequential from '@/gameplay/rules/isSequential'
import IRule from '@/interfaces/IRule'
import BaseCard from './BaseCard'

export default class Card extends BaseCard {
  public suit: string

  public rank: number

  public revealed: boolean = false

  public rules: IRule[] = [
    isBuildable,
    hasAlternatingColorBeforePromotion,
    hasSameSuitAfterPromotion,
    isSequential
  ]

  constructor (suit: string, rank: number) {
    super()

    this.suit = suit
    this.rank = rank
  }

  public toString () {
    return `${this.rank + 1} of ${this.suit}`
  }
}
