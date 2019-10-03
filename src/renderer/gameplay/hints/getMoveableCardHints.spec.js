import getMoveableCardHints from './getMoveableCardHints'
import Card from '../../store/models/Card'
import LaneSpace from '../../store/models/LaneSpace'
import FoundationSpace from '../../store/models/FoundationSpace'
import { Suits } from '../../constants'

describe('Hint: getMoveableCardHints', () => {
  const sixOfDiamonds = new Card(Suits.DIAMONDS, 5)
  const sevenOfClubs = new Card(Suits.CLUBS, 6)
  const sevenOfSpades = new Card(Suits.SPADES, 6)
  const aceOfHearts = new Card(Suits.HEARTS, 0)
  const kingOfSpades = new Card(Suits.SPADES, 12)
  const laneSpace = new LaneSpace()
  const foundationSpace = new FoundationSpace()
  const cards = [
    sixOfDiamonds,
    sevenOfClubs,
    sevenOfSpades,
    aceOfHearts,
    kingOfSpades,
    laneSpace,
    foundationSpace
  ]
  let hints

  cards.forEach(card => {
    card.isPlayed = card.revealed = true
  })

  beforeEach(() => {
    hints = getMoveableCardHints(cards, cards)
  })

  it('should generate exactly three hints', () => {
    expect(hints).toHaveLength(3)
  })

  it('should hint the 6 of Diamonds to be placed onto the 7 of Clubs', () => {
    expect(hints).toEqual(expect.arrayContaining([
      expect.arrayContaining([sixOfDiamonds.id, sevenOfClubs.id])
    ]))
  })

  it('should hint the Ace of Hearts to be placed onto the empty foundation space', () => {
    expect(hints).toEqual(expect.arrayContaining([
      expect.arrayContaining([aceOfHearts.id, foundationSpace.id])
    ]))
  })
})
