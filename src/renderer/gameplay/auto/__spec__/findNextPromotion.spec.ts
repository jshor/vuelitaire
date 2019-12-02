import Card from '@/models/Card'
import { Suits } from '@/constants'
import Pair from '@/models/Pair'
import IDeckState from '@/interfaces/IDeckState'
import LaneSpace from '@/models/LaneSpace'
import FoundationSpace from '@/models/FoundationSpace'
import findNextPromotion from '../findNextPromotion'
import generateDeckState from './__helpers__/generateDeckState'

describe('findNextPromotion()', () => {
  it('should promote a card from the tableaux', () => {
    const card: Card = new Card(Suits.CLUBS, 1)
    const target: Card = new Card(Suits.CLUBS, 0)
    const lane: LaneSpace = new LaneSpace()
    const foundation: FoundationSpace = new FoundationSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [target.id]: target,
      [lane.id]: lane
    })

    state.cards.foundations[foundation.id] = foundation
    state.cards.tableau[lane.id] = lane

    card.revealed = true
    target.revealed = true
    target.promoted = true
    lane.child = card
    card.parent = lane
    foundation.child = target
    target.parent = foundation

    expect(findNextPromotion(state)).toEqual(
      expect.objectContaining(new Pair(card.id, target.id))
    )
  })

  it('should promote a card from the dealt pile', () => {
    const card: Card = new Card(Suits.CLUBS, 1)
    const target: Card = new Card(Suits.CLUBS, 0)
    const foundation: FoundationSpace = new FoundationSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [target.id]: target
    })

    state.cards.foundations[foundation.id] = foundation
    state.dealt = [card]

    card.revealed = true
    target.revealed = true
    target.promoted = true
    target.parent = foundation
    foundation.child = target

    expect(findNextPromotion(state)).toEqual(
      expect.objectContaining(new Pair(card.id, target.id))
    )
  })

  it('should not promote the card in the dealt pile if there is no target promotion', () => {
    const card: Card = new Card(Suits.CLUBS, 1)
    const target: Card = new Card(Suits.DIAMONDS, 0)
    const foundation: FoundationSpace = new FoundationSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [target.id]: target
    })

    state.cards.foundations[foundation.id] = foundation
    state.dealt = [card]

    card.revealed = true
    foundation.child = target
    target.parent = foundation

    expect(findNextPromotion(state)).toBeNull()
  })

  it('should not return any pair if the tableaux contains no promotable card', () => {
    const card: Card = new Card(Suits.CLUBS, 1)
    const lane: LaneSpace = new LaneSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [lane.id]: lane
    })

    card.revealed = true
    lane.child = card
    card.parent = lane

    expect(findNextPromotion(state)).toBeNull()
  })
})
