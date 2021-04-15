import { Suits } from '@/constants'
import IDeckState from '@/interfaces/IDeckState'
import Card from '@/models/Card'
import canAutocomplete from '../canAutocomplete'
import generateDeckState from './__helpers__/generateDeckState'

describe('canAutocomplete()', () => {
  let deck: IDeckState

  beforeEach(() => {
    deck = generateDeckState({
      regular: {},
      foundations: {},
      tableau: {},
      unrevealedCount: 52
    })
  })

  describe('when all cards are revealed', () => {
    beforeEach(() => {
      deck.cards.unrevealedCount = 0
    })

    it('should return true if the dealCount is 1', () => {
      deck.dealCount = 1

      expect(canAutocomplete(deck)).toEqual(true)
    })

    it('should return true if the dealCount is 3 but only 2 cards remain in the deck', () => {
      deck.dealCount = 3
      deck.waste = [
        new Card(Suits.HEARTS, 2),
        new Card(Suits.SPADES, 3)
      ]

      expect(canAutocomplete(deck)).toEqual(true)
    })

    it('should return false if the dealCount is 3 and three cards are in the deck', () => {
      deck.dealCount = 3
      deck.waste = [
        new Card(Suits.CLUBS, 1),
        new Card(Suits.HEARTS, 2),
        new Card(Suits.SPADES, 3)
      ]

      expect(canAutocomplete(deck)).toEqual(false)
    })
  })

  it('should return false if not all cards are revealed', () => {
    expect(canAutocomplete(deck)).toEqual(false)
  })
})
