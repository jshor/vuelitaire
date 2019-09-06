import uuid from 'uuid/v4'

export default class Foundation { // rename to Space
  constructor (type) {
    this.id = uuid()
    this.child = null
    this.type = type
  }
}
