import { Suits } from '@/constants'
import ICard from '@/interfaces/ICard'
import IDeckState from '@/interfaces/IDeckState'
import Card from '@/models/Card'
import FoundationSpace from '@/models/FoundationSpace'
import LaneSpace from '@/models/LaneSpace'
import Pair from '@/models/Pair'
import findNextMove from '../findNextMove'
import generateDeckState from './__helpers__/generateDeckState'

describe('findNextMove()', () => {
  function assignFalseParents (deckState) {
    const parent = new Card(Suits.DIAMONDS, 12)

    Object
      .values(deckState.cards.regular)
      .forEach((card: ICard) => {
        card.revealed = true
        card.parent = parent
      })

    deckState.cards.regular[parent.id] = parent
  }

  it('should return a Pair where the target card is in a Lane Space within the tableaux', () => {
    const card: Card = new Card(Suits.CLUBS, 3)
    const target: Card = new Card(Suits.DIAMONDS, 4)
    const base: LaneSpace = new LaneSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [target.id]: target,
      [base.id]: base
    })

    state.cards.tableau[base.id] = base
    base.child = target
    target.parent = base
    assignFalseParents(state)

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

    state.cards.foundations[base.id] = base
    target.promoted = true
    base.child = target
    target.parent = base
    assignFalseParents(state)

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

    target1.promoted = true
    foundation.child = target1
    lane.child = target2
    target2.parent = lane
    target1.parent = foundation

    state.cards.foundations[foundation.id] = foundation
    state.cards.tableau[lane.id] = lane

    assignFalseParents(state)

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
