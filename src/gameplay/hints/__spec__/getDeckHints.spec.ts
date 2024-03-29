import { Suits } from '@/constants'
import IDeckState from '@/interfaces/IDeckState'
import Card from '@/models/Card'
import getDeckHints from '../getDeckHints'
import createDeckState from './__helpers__/createDeckState'

describe('Hint: getDeckHints', () => {
  const aceOfSpades: Card = new Card(Suits.SPADES, 0)
  const twoOfHearts: Card = new Card(Suits.HEARTS, 1)
  const sixOfSpades: Card = new Card(Suits.SPADES, 6)
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
    twoOfHearts.parent = new Card(Suits.DIAMONDS, 6)
  })

  it('should return the DEAL_CARD hint for a moveable card within the deck', () => {
    const deck: IDeckState = createDeckState()

    deck.stock = stock
    deck.waste = [aceOfSpades]
    deck.dealCount = 1

    expect(getDeckHints(stock, stock, deck)).toEqual([
      expect.arrayContaining(['DEAL_CARD'])
    ])
  })

  it('should return an empty array if there are no cards in the waste pile', () => {
    const deck: IDeckState = createDeckState()

    expect(getDeckHints(stock, stock, deck)).toEqual([])
  })

  it('should return an empty array if there are no cards that can be moved from the dealt pile', () => {
    const deck: IDeckState = createDeckState()

    deck.stock = []
    deck.waste = [sixOfSpades]

    expect(getDeckHints(stock, stock, deck)).toEqual([])
  })
})
