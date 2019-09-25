import getMoveableCardHints from './getMoveableCardHints'
import Card from '../../store/models/Card'
import Space from '../../store/models/Space'
import { Suits } from '../../constants'

describe('Hint: getMoveableCardHints', () => {
  const cards = [
    new Card(Suits.DIAMONDS, 5),
    new Card(Suits.CLUBS, 6),
    new Card(Suits.HEARTS, 0),
    new Card(Suits.SPADES, 12),
    new Space('TABLEAU'),
    new Space('FOUNDATION')
  ]
  const topWasteCard = new Card(Suits.SPADES, 10)
  let hints

  cards.forEach(card => {
    card.isPlayed = card.revealed = true
  })

  beforeEach(() => {
    hints = getMoveableCardHints(cards, topWasteCard)
  })

  it('should generate exactly three hints', () => {
    expect(hints).toHaveLength(3)
  })

  it('should hint the 5 of Diamonds to be placed onto the 6 of Clubs', () => {
    expect(hints).toEqual(expect.arrayContaining([
      expect.arrayContaining([cards[0].id, cards[1].id])
    ]))
  })

  it('should hint the Ace of Hearts to be placed onto the empty foundation space', () => {
    expect(hints).toEqual(expect.arrayContaining([
      expect.arrayContaining([cards[2].id, cards[5].id])
    ]))
  })

  it('should hint the King of Spades to be placed onto the empty tableau space', () => {
    expect(hints).toEqual(expect.arrayContaining([
      expect.arrayContaining([cards[3].id, cards[4].id])
    ]))
  })
})
