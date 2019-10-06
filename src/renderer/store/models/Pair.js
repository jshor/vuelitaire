export default class Pair {
  constructor (cardId = null, targetId = null) {
    this.cardId = cardId
    this.targetId = targetId
    this.parentId = null
  }
}
