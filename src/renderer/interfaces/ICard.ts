export default interface ICard {
  id: uuid

  child: ICard

  promoted: boolean

  isPlayed: boolean

  revealed: boolean

  animationIndex: number

  suit: string

  rank: number

  isPlayable: () => boolean

  canAcceptCard: (card: ICard) => boolean
}
