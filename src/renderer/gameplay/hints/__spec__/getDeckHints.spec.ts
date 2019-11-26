import Card from '../../../models/Card'
import { Suits } from '../../../constants'
import { DeckState } from '../../../store/modules/deck'
import getDeckHints from '../getDeckHints'

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
    aceOfSpades.isPlayed = aceOfSpades.revealed = true
    twoOfHearts.isPlayed = twoOfHearts.revealed = true
    sixOfSpades.isPlayed = sixOfSpades.revealed = true
  })

  it('should return the DEAL_CARD hint for a moveable card within the deck', () => {
    const deck = new DeckState()

    deck.stock = stock
    deck.waste = [aceOfSpades]
    deck.dealCount = 1

    expect(getDeckHints(stock, stock, deck)).toEqual([
      expect.arrayContaining(['DEAL_CARD'])
    ])
  })

  it('should return an empty array if there are no cards in the waste pile', () => {
    const deck = new DeckState()

    expect(getDeckHints(stock, stock, deck)).toEqual([])
  })

  it('should return an empty array if there are no cards that can be moved from the dealt pile', () => {
    const deck = new DeckState()

    deck.stock = []
    deck.waste = [sixOfSpades]

    expect(getDeckHints(stock, stock, deck)).toEqual([])
  })
})
