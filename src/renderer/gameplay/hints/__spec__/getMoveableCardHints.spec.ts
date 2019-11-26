import getMoveableCardHints from '../getMoveableCardHints'
import Card from '../../../models/Card'
import LaneSpace from '../../../models/LaneSpace'
import FoundationSpace from '../../../models/FoundationSpace'
import ICard from '../../../types/interfaces/ICard'
import { Suits } from '../../../constants'
import { DeckState } from '../../../store/modules/deck'

describe('Hint: getMoveableCardHints', () => {
  const sixOfDiamonds: ICard = new Card(Suits.DIAMONDS, 5)
  const sevenOfClubs: ICard = new Card(Suits.CLUBS, 6)
  const sevenOfSpades: ICard = new Card(Suits.SPADES, 6)
  const aceOfHearts: ICard = new Card(Suits.HEARTS, 0)
  const kingOfSpades: ICard = new Card(Suits.SPADES, 12)
  const laneSpace: ICard = new LaneSpace()
  const foundationSpace: ICard = new FoundationSpace()
  const cards: ICard[] = [
    sixOfDiamonds,
    sevenOfClubs,
    sevenOfSpades,
    aceOfHearts,
    kingOfSpades,
    laneSpace,
    foundationSpace
  ]
  const deck = new DeckState()
  let hints: string[][]

  cards.forEach((card: ICard): void => {
    card.isPlayed = card.revealed = true
  })

  beforeEach(() => {
    hints = getMoveableCardHints(cards, cards, deck)
  })

  xit('should generate exactly three hints', () => {
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
