import Space from './Space'
import hasOppositeColorBeforePromotion from '../../rules/hasOppositeColorBeforePromotion'
import isSequential from '../../rules/isSequential'

export default class Card extends Space {
  constructor (suit, rank) {
    super('CARD', rank)

    this.suit = suit
    this.revealed = false
    this.isPlayed = false

    this.rules.push(hasOppositeColorBeforePromotion)
    this.rules.push(isSequential)
  }
}
