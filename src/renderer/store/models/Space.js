import uuid from 'uuid/v4'
import isBuildable from '../../rules/isBuildable'

export default class Space {
  constructor (type, rank) {
    this.id = uuid()
    this.type = type
    this.rank = rank
    this.child = null
    this.isPlayed = true
    this.revealed = true
    this.rules = [isBuildable]

    if (this.type === 'FOUNDATION') {
      this.rules.push((parent, child) => {
        return child.rank === 0
      })
    }
    if (this.type === 'TABLEAU') {
      this.rules.push((parent, child) => child.rank === 12)
    }
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
