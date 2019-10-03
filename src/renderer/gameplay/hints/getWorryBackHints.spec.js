import Card from '../../store/models/Card'
import LaneSpace from '../../store/models/LaneSpace'
import { Suits } from '../../constants'
import getWorryBackHints from './getWorryBackHints'
import FoundationSpace from '../../store/models/FoundationSpace'

describe('Hint: getWorryBackHints', () => {
  const laneSpace1 = new LaneSpace()
  const laneSpace2 = new LaneSpace()
  const foundationSpace = new FoundationSpace()
  const unrevealedParent = new Card(Suits.SPADES, 11)
  const untouchedTopCard = new Card(Suits.HEARTS, 6)
  const receivableTopCard = new Card(Suits.DIAMONDS, 8)
  const promotedChild = new Card(Suits.SPADES, 7)
  const promotedParent = new Card(Suits.SPADES, 6)
  const unplayedCard = new Card(Suits.DIAMONDS, 6)

  beforeEach(() => {
    untouchedTopCard.isPlayed =
    receivableTopCard.isPlayed =
    untouchedTopCard.revealed =
    receivableTopCard.revealed =
    unplayedCard.revealed =
    promotedParent.promoted =
    promotedChild.promoted = true
  })

  const cards = [
    foundationSpace,
    laneSpace1,
    laneSpace2,
    unrevealedParent,
    receivableTopCard,
    promotedChild,
    promotedParent,
    unplayedCard
  ]

  describe('when a marryable card whose parent is unplayable exists in the tableaux', () => {
    beforeEach(() => {
      // set up the hierarchy
      laneSpace1.child = unrevealedParent
      laneSpace2.child = receivableTopCard
      foundationSpace.child = promotedParent
      unrevealedParent.child = untouchedTopCard
      promotedParent.child = promotedChild
    })

    it('should hint that a card should be worried back if its parent can marry one in the tableaux', () => {
      const hints = getWorryBackHints([
        ...cards,
        untouchedTopCard
      ], {
        cards: [],
        waste: [],
        dealt: [],
        dealCount: 1
      })

      expect(hints).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            promotedChild.id,
            receivableTopCard.id
          ])
        ])
      )
    })

    it('should hint that a card should be worried back if its parent can marry one in the waste pile', () => {
      const hints = getWorryBackHints([
        ...cards,
        unplayedCard
      ], {
        cards: [],
        waste: [unplayedCard],
        dealt: [],
        dealCount: 1
      })

      expect(hints).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            promotedChild.id,
            receivableTopCard.id
          ])
        ])
      )
    })

    it('should hint that a card should be worried back if its parent can marry one in the stock pile', () => {
      const hints = getWorryBackHints([
        ...cards,
        unplayedCard
      ], {
        cards: [unplayedCard],
        waste: [],
        dealt: [],
        dealCount: 1
      })

      expect(hints).toEqual(
        expect.arrayContaining([
          expect.arrayContaining([
            promotedChild.id,
            receivableTopCard.id
          ])
        ])
      )
    })
  })
})
