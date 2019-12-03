import { Suits } from '@/constants'
import Card from '@/models/Card'
import Pair from '@/models/Pair'
import cardMove from '../cardMove'
import generateDeckState from './__helpers__/generateDeckState'

describe('cardMove()', () => {
  describe('getPointsFromUndo()', () => {
    describe('when a card is returned to the waste pile', () => {
      it('should return -10 if the card was promoted', () => {
        const card = new Card(Suits.CLUBS, 1)
        const pair = new Pair(card.id)

        card.promoted = true

        const state = generateDeckState({
          [card.id]: card
        })

        expect(cardMove(pair, state)).toEqual(-10)
      })

      it('should return -5 if the card was not promoted', () => {
        const card = new Card(Suits.CLUBS, 1)
        const pair = new Pair(card.id)

        const state = generateDeckState({
          [card.id]: card
        })

        expect(cardMove(pair, state)).toEqual(-5)
      })
    })

    it('should return -3 for a card being returned to a parent that is unrevealed', () => {
      const card = new Card(Suits.CLUBS, 1)
      const target = new Card(Suits.HEARTS, 5)
      const pair = new Pair(card.id, target.id)

      target.revealed = false

      const state = generateDeckState({
        [card.id]: card,
        [target.id]: target
      })

      expect(cardMove(pair, state)).toEqual(-3)
    })

    it('should return -15 if the card was promoted from the deck', () => {
      const card = new Card(Suits.CLUBS, 1)
      const target = new Card(Suits.HEARTS, 5)
      const pair = new Pair(card.id, target.id)

      target.revealed = true
      card.promoted = true

      const state = generateDeckState({
        [card.id]: card,
        [target.id]: target
      })

      expect(cardMove(pair, state)).toEqual(-15)
    })
  })

  describe('getPointsFromPlay()', () => {
    it('should return 10 for a card being promoted from the deck', () => {
      const card = new Card(Suits.CLUBS, 1)
      const target = new Card(Suits.HEARTS, 5)
      const pair = new Pair(card.id, target.id)

      target.promoted = true
      target.revealed = true

      const state = generateDeckState({
        [card.id]: card,
        [target.id]: target
      })

      expect(cardMove(pair, state)).toEqual(10)
    })

    it('should return 15 for a card being promoted from an unrevealed parent', () => {
      const card = new Card(Suits.CLUBS, 1)
      const target = new Card(Suits.HEARTS, 5)
      const pair = new Pair(card.id, target.id)

      target.promoted = true
      target.revealed = true

      card.parent = new Card(Suits.DIAMONDS, 3)

      const state = generateDeckState({
        [card.id]: card,
        [target.id]: target
      })

      expect(cardMove(pair, state)).toEqual(15)
    })

    it('should return 5 for a card moved from the deck to the tableaux', () => {
      const card = new Card(Suits.CLUBS, 1)
      const target = new Card(Suits.HEARTS, 5)
      const pair = new Pair(card.id, target.id)

      target.promoted = false
      target.revealed = true

      const state = generateDeckState({
        [card.id]: card,
        [target.id]: target
      })

      expect(cardMove(pair, state)).toEqual(5)
    })

    it('should return 0 if no point rules apply', () => {
      const card = new Card(Suits.CLUBS, 1)
      const target = new Card(Suits.HEARTS, 5)
      const pair = new Pair(card.id, target.id)

      target.revealed = true
      target.promoted = false
      card.promoted = false
      card.parent = new Card(Suits.DIAMONDS, 8)

      const state = generateDeckState({
        [card.id]: card,
        [target.id]: target
      })

      expect(cardMove(pair, state)).toEqual(0)
    })
  })

  it('should return 0 if there are no cards involved in the given move', () => {
    expect(cardMove(new Pair(), generateDeckState({}))).toEqual(0)
  })
})
