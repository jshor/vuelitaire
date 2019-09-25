import uuid from 'uuid/v4'
import { isBuildable } from '../../gameplay'

export default class Space {
  constructor () {
    this.id = uuid()
    this.child = null
    this.isPlayed = true
    this.revealed = true
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
}
