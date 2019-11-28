import BaseCard from './BaseCard'
import hasAlternatingColorBeforePromotion from '../gameplay/rules/hasAlternatingColorBeforePromotion'
import hasSameSuitAfterPromotion from '../gameplay/rules/hasSameSuitAfterPromotion'
import isSequential from '../gameplay/rules/isSequential'
import isBuildable from '../gameplay/rules/isBuildable'
import IRule from '../interfaces/IRule'

export default class Card extends BaseCard {
  public suit: string

  public rank: number

  public isPlayed: boolean = false

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
