import { MoveType } from "./enums/MoveType"

type CardMove = {
  type: MoveType.MOVE
  cardId: string
  fromId: string
  toId: string
  /** Whether or not this move revealed its parent (`fromId`) */
  revealed: boolean
}

type DealMove = {
  type: MoveType.DEAL
  wastedCardIds: string[]
}

export type Move<T = MoveType> =
  T extends MoveType.MOVE ? CardMove :
  T extends MoveType.DEAL ? DealMove :
  never
