import BaseCard from './BaseCard'
import hasAlternatingColorBeforePromotion from '../gameplay/rules/hasAlternatingColorBeforePromotion'
import hasSameSuitAfterPromotion from '../gameplay/rules/hasSameSuitAfterPromotion'
import isSequential from '../gameplay/rules/isSequential'

export default class Card extends BaseCard {
  public suit: string

  public rank: number

  public isPlayed: boolean = false

  public revealed: boolean = false

  public type: string = 'Card'

  constructor (suit: string, rank: number) {
    super()

    this.suit = suit
    this.rank = rank

    this.rules.push(hasAlternatingColorBeforePromotion)
    this.rules.push(hasSameSuitAfterPromotion)
    this.rules.push(isSequential)
  }

  public toString () {
    return `${this.rank + 1} of ${this.suit}`
  }
}
