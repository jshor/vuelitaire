import { Suits } from '@/constants'
import { State } from '@/store/state'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { getDeckHints } from '../getDeckHints'
import { createDeckState } from './__helpers__/createDeckState'

describe('Hint: getDeckHints', () => {
  const aceOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 0 })
  const twoOfHearts: Card = createCard({ suit: Suits.HEARTS, rank: 1 })
  const sixOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 6 })
  const stock: Card[] = [
    aceOfSpades,
    twoOfHearts,
    sixOfSpades
  ]

  beforeEach(() => {

    // make the cards playable
    aceOfSpades.revealed = true
    twoOfHearts.revealed = true
    sixOfSpades.revealed = true

    // add a parent to make this a legitimate tableaux card
    twoOfHearts.parent = createCard({ suit: Suits.DIAMONDS, rank: 6 })
  })

  it('should return the DEAL_CARD hint for a moveable card within the deck', () => {
    const deck: State = createDeckState()

    deck.stock = stock
    deck.waste = [aceOfSpades]

    expect(getDeckHints(stock, stock, deck)).toEqual([
      expect.arrayContaining(['DEAL_CARD'])
    ])
  })

  it('should return an empty array if there are no cards in the waste pile', () => {
    const deck: State = createDeckState()

    expect(getDeckHints(stock, stock, deck)).toEqual([])
  })

  it('should return an empty array if there are no cards that can be moved from the dealt pile', () => {
    const deck: State = createDeckState()

    deck.stock = []
    deck.waste = [sixOfSpades]

    expect(getDeckHints(stock, stock, deck)).toEqual([])
  })
})
