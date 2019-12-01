import getMoveableCardHints from '../getMoveableCardHints'
import Card from '../../../models/Card'
import LaneSpace from '../../../models/LaneSpace'
import FoundationSpace from '../../../models/FoundationSpace'
import ICard from '../../../interfaces/ICard'
import { Suits } from '../../../constants'
import createDeckState from './__helpers__/createDeckState'
import IDeckState from '../../../interfaces/IDeckState'

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
  const deck: IDeckState = createDeckState({
    foundations: {
      [foundationSpace.id]: foundationSpace
    },
    tableau: {
      [laneSpace.id]: laneSpace
    },
    regular: {
      [sixOfDiamonds.id]: sixOfDiamonds,
      [sevenOfClubs.id]: sevenOfClubs,
      [sevenOfSpades.id]: sevenOfSpades,
      [aceOfHearts.id]: aceOfHearts,
      [kingOfSpades.id]: kingOfSpades
    }
  })
  let hints: string[][]

  cards.forEach((card: ICard): void => {
    card.revealed = true
    card.parent = new Card(Suits.DIAMONDS, 2)
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
