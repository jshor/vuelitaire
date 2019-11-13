import uuid from 'uuid/v4'
import { isBuildable } from '../../gameplay'

export default class Space {
  constructor () {
    this.id = uuid()
    this.child = null
    this.promoted = false
    this.isPlayed = true
    this.revealed = true
    this.type = null
    this.animationIndex = 0
    this.rules = [isBuildable]
  }

  isPlayable () {
    return this.isPlayed && this.revealed
  }

  canAcceptCard (card) {
    return this.rules.reduce((result, rule) => {
      return rule(this, card) && result
    }, true)
  }

  toString () {
    return `${this.type}`
  }
}
