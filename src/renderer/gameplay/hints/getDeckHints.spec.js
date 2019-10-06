import Card from '../../store/models/Card'
import { Suits } from '../../constants'
import getDeckHints from './getDeckHints'

describe('Hint: getDeckHints', () => {
  const aceOfSpades = new Card(Suits.SPADES, 0)
  const twoOfHearts = new Card(Suits.HEARTS, 1)
  const sixOfSpades = new Card(Suits.SPADES, 6)
  const stock = [
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
    const deck = {
      stock,
      waste: [aceOfSpades],
      dealCount: 1
    }

    expect(getDeckHints(stock, deck)).toEqual(['DEAL_CARD'])
  })

  it('should return an empty array if there are no cards in the waste pile', () => {
    const deck = {
      stock: [],
      waste: [],
      dealCount: 1
    }

    expect(getDeckHints(stock, deck)).toEqual([])
  })

  it('should return an empty array if there are no cards that can be moved from the dealt pile', () => {
    const deck = {
      stock: [],
      waste: [sixOfSpades],
      dealCount: 1
    }

    expect(getDeckHints(stock, deck)).toEqual([])
  })
})
