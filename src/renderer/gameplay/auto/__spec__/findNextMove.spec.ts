import Card from '../../../models/Card'
import { Suits } from '../../../constants'
import Pair from '../../../models/Pair'
import IDeckState from '../../../interfaces/IDeckState'
import LaneSpace from '../../../models/LaneSpace'
import FoundationSpace from '../../../models/FoundationSpace'
import findNextMove from '../findNextMove'
import generateDeckState from './__helpers__/generateDeckState'

describe('findNextMove()', () => {
  it('should return a Pair where the target card is in a Lane Space within the tableaux', () => {
    const card: Card = new Card(Suits.CLUBS, 3)
    const target: Card = new Card(Suits.DIAMONDS, 4)
    const base: LaneSpace = new LaneSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [target.id]: target,
      [base.id]: base
    })

    card.isPlayed = card.revealed = true
    target.isPlayed = target.revealed = true
    base.child = target

    const pair: Pair = findNextMove(state, card)

    expect(pair).not.toBeNull()
    expect(pair).toEqual(expect.objectContaining(new Pair(card.id, target.id)))
  })

  it('should return a Pair where the target card is in a Foundation', () => {
    const card: Card = new Card(Suits.CLUBS, 1)
    const target: Card = new Card(Suits.CLUBS, 0)
    const base: FoundationSpace = new FoundationSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [target.id]: target,
      [base.id]: base
    })

    card.isPlayed = card.revealed = true
    target.isPlayed = target.revealed = true
    target.promoted = true
    base.child = target

    const pair: Pair = findNextMove(state, card)

    expect(pair).not.toBeNull()
    expect(pair).toEqual(expect.objectContaining(new Pair(card.id, target.id)))
  })

  it('should prioritize a promotion over a move into the tableaux', () => {
    const card: Card = new Card(Suits.CLUBS, 1)
    const target1: Card = new Card(Suits.CLUBS, 0)
    const target2: Card = new Card(Suits.DIAMONDS, 2)
    const foundation: FoundationSpace = new FoundationSpace()
    const lane: LaneSpace = new LaneSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [target1.id]: target1,
      [target2.id]: target2,
      [foundation.id]: foundation,
      [lane.id]: lane
    })

    card.isPlayed = card.revealed = true
    target1.isPlayed = target1.revealed = true
    target2.isPlayed = target2.revealed = true
    target1.promoted = true
    foundation.child = target1
    lane.child = target2

    const pair: Pair = findNextMove(state, card)

    expect(pair).not.toBeNull()
    expect(pair).toEqual(expect.objectContaining(new Pair(card.id, target1.id)))
  })

  it('should return null if no applicable move was found', () => {
    const card: Card = new Card(Suits.CLUBS, 1)
    const state: IDeckState = generateDeckState({ [card.id]: card })

    const pair: Pair = findNextMove(state, card)

    expect(pair).toBeNull()
  })
})
