import { Suits } from '@/constants'
import ICard from '@/interfaces/ICard'
import IDeckState from '@/interfaces/IDeckState'
import Card from '@/models/Card'
import FoundationSpace from '@/models/FoundationSpace'
import LaneSpace from '@/models/LaneSpace'
import getWorryBackHints from '../getWorryBackHints'
import createDeckState from './__helpers__/createDeckState'

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
    let deck: IDeckState

    beforeEach(() => {
      deck = createDeckState()

      // set up the hierarchy
      laneSpace1.child = unrevealedParent
      laneSpace2.child = receivableTopCard
      foundationSpace.child = promotedParent
      unrevealedParent.child = untouchedTopCard
      promotedParent.child = promotedChild

      unrevealedParent.parent = laneSpace1
      receivableTopCard.parent = laneSpace2
      promotedChild.parent = foundationSpace
      untouchedTopCard.parent = unrevealedParent
      promotedChild.parent = promotedParent

      deck.cards = {
        foundations: {
          [foundationSpace.id]: foundationSpace
        },
        tableau: {
          [laneSpace1.id]: laneSpace1,
          [laneSpace2.id]: laneSpace2
        },
        regular: {
          [unrevealedParent.id]: unrevealedParent,
          [receivableTopCard.id]: receivableTopCard,
          [promotedChild.id]: promotedChild,
          [promotedParent.id]: promotedParent,
          [unplayedCard.id]: unplayedCard,
        }
      }
    })

    it('should hint that a card should be worried back if its parent can marry one in the tableaux', () => {
      deck.cards.tableau[untouchedTopCard.id] = untouchedTopCard

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
