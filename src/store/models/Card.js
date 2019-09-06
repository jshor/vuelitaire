import Foundation from './Foundation'

export default class Card extends Foundation {
  constructor (suit, rank) {
    super()

    this.suit = suit
    this.rank = rank
    this.child = null
    this.revealed = false
  }
}
