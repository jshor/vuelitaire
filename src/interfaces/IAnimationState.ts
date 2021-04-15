export default interface IAnimationState {
  cardId: string // the card being moved
  targetId: string // the card to place onto
  parentId: string // the previous parent of `cardId`
  inProgress: boolean
}
