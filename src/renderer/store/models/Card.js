import BaseModel from './BaseModel'
import {
  hasOppositeColorBeforePromotion,
  isSequential
} from '../../gameplay'

export default class Card extends BaseModel {
  constructor (suit, rank) {
    super()

    this.suit = suit
    this.rank = rank
    this.revealed = false
    this.isPlayed = false

    this.rules.push(hasOppositeColorBeforePromotion)
    this.rules.push(isSequential)
  }
}
