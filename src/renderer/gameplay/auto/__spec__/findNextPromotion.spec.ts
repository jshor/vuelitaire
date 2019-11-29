import Card from '../../../models/Card'
import { Suits } from '../../../constants'
import Pair from '../../../models/Pair'
import IDeckState from '../../../interfaces/IDeckState'
import ICardsState from '../../../interfaces/ICardsState'
import LaneSpace from '../../../models/LaneSpace'
import FoundationSpace from '../../../models/FoundationSpace'
import findNextPromotion from '../findNextPromotion'
import generateDeckState from './__helpers__/generateDeckState'

describe('findNextMove()', () => {
  it('should promote a card from the tableaux', () => {
    const card: Card = new Card(Suits.CLUBS, 1)
    const target: Card = new Card(Suits.CLUBS, 0)
    const lane: LaneSpace = new LaneSpace()
    const foundation: FoundationSpace = new FoundationSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [target.id]: target,
      [lane.id]: lane,
      [foundation.id]: foundation
    })

    card.isPlayed = card.revealed = true
    target.isPlayed = target.revealed = true
    target.promoted = true
    lane.child = card
    foundation.child = target

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
      [target.id]: target,
      [foundation.id]: foundation
    })

    state.waste = [card]
    card.isPlayed = card.revealed = true
    target.isPlayed = target.revealed = true
    target.promoted = true
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
      [target.id]: target,
      [foundation.id]: foundation
    })

    state.dealt = [card]
    card.isPlayed = card.revealed = true
    foundation.child = target

    expect(findNextPromotion(state)).toBeNull()
  })

  it('should not return any pair if the tableaux contains no promotable card', () => {
    const card: Card = new Card(Suits.CLUBS, 1)
    const lane: LaneSpace = new LaneSpace()
    const state: IDeckState = generateDeckState({
      [card.id]: card,
      [lane.id]: lane
    })

    card.isPlayed = card.revealed = true
    lane.child = card

    expect(findNextPromotion(state)).toBeNull()
  })
})
