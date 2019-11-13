import BaseModel from './BaseModel'
import {
  hasAlternatingColorBeforePromotion,
  hasSameSuitAfterPromotion,
  isSequential
} from '../../gameplay'

export default class Card extends BaseModel {
  constructor (suit, rank) {
    super()

    this.suit = suit
    this.rank = rank
    this.revealed = false
    this.isPlayed = false
    this.animationIndex = 0

    this.rules.push(hasAlternatingColorBeforePromotion)
    this.rules.push(hasSameSuitAfterPromotion)
    this.rules.push(isSequential)
    this.type = 'Card'
  }

  toString () {
    return `${this.rank + 1} of ${this.suit}`
  }
}
