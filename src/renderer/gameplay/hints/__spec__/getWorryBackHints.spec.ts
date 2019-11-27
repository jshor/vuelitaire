import Card from '../../../models/Card'
import LaneSpace from '../../../models/LaneSpace'
import ICard from '../../../interfaces/ICard'
import { Suits } from '../../../constants'
import getWorryBackHints from '../getWorryBackHints'
import FoundationSpace from '../../../models/FoundationSpace'
import createDeckState from './__helpers__/createDeckState'
import IDeckState from '../../../interfaces/IDeckState'

describe('Hint: getWorryBackHints', () => {
  const laneSpace1: ICard = new LaneSpace()
  const laneSpace2: ICard = new LaneSpace()
  const foundationSpace: ICard = new FoundationSpace()
  const unrevealedParent: ICard = new Card(Suits.SPADES, 11)
  const untouchedTopCard: ICard = new Card(Suits.HEARTS, 6)
  const receivableTopCard: ICard = new Card(Suits.DIAMONDS, 8)
  const promotedChild: ICard = new Card(Suits.SPADES, 7)
  const promotedParent: ICard = new Card(Suits.SPADES, 6)
  const unplayedCard: ICard = new Card(Suits.DIAMONDS, 6)

  beforeEach(() => {
    untouchedTopCard.isPlayed =
    receivableTopCard.isPlayed =
    untouchedTopCard.revealed =
    receivableTopCard.revealed =
    unplayedCard.revealed =
    promotedParent.promoted =
    promotedChild.promoted = true
  })

  const cards: ICard[] = [
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
      const deck: IDeckState = createDeckState()
      const hints: string[][] = getWorryBackHints([
        ...cards,
        untouchedTopCard
      ], cards, deck)

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
      const deck: IDeckState = createDeckState()
      deck.waste = [unplayedCard]
      const hints: string[][] = getWorryBackHints([
        ...cards,
        unplayedCard
      ], cards, deck)

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
      const deck: IDeckState = createDeckState()
      deck.waste = [unplayedCard]
      const hints: string[][] = getWorryBackHints([
        ...cards,
        unplayedCard
      ], cards, deck)

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
