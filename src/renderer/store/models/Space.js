import uuid from 'uuid/v4'

export default class Space {
  constructor (type) {
    this.id = uuid()
    this.child = null
    this.type = type
  }
}
