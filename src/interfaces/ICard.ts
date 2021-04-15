export default interface ICard {
  id: string

  child: ICard

  parent: ICard

  promoted: boolean

  hasError: boolean

  revealed: boolean

  animationIndex: number

  suit: string

  rank: number

  canAcceptCard: (card: ICard) => boolean
}
