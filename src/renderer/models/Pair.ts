export default class Pair {
  public cardId: string

  public targetId: string

  public parentId: string = null

  constructor (cardId = null, targetId = null) {
    this.cardId = cardId
    this.targetId = targetId
  }
}
