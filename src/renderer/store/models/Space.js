import uuid from 'uuid/v4'

export default class Space {
  constructor (type) {
    this.id = uuid()
    this.type = type
    this.child = null
    this.isPlayed = true
    this.revealed = true
  }
}
