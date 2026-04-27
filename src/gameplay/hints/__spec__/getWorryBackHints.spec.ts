import { Suits } from '@/constants'
import { ICard } from '@/interfaces/ICard'
import { State } from '@/store/state'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { FoundationSpace } from '@/types/FoundationSpace'
import { createFoundationSpace } from '@/models/FoundationSpace'
import { LaneSpace } from '@/types/LaneSpace'
import { createLaneSpace } from '@/models/LaneSpace'
import { getWorryBackHints } from '../getWorryBackHints'
import { createDeckState } from './__helpers__/createDeckState'

describe('Hint: getWorryBackHints', () => {
  const laneSpace1: ICard = createLaneSpace()
  const laneSpace2: ICard = createLaneSpace()
  const foundationSpace: ICard = createFoundationSpace()
  const unrevealedParent: ICard = createCard({ suit: Suits.SPADES, rank: 11 })
  const untouchedTopCard: ICard = createCard({ suit: Suits.HEARTS, rank: 6 })
  const receivableTopCard: ICard = createCard({ suit: Suits.DIAMONDS, rank: 8 })
  const promotedChild: ICard = createCard({ suit: Suits.SPADES, rank: 7 })
  const promotedParent: ICard = createCard({ suit: Suits.SPADES, rank: 6 })
  const unplayedCard: ICard = createCard({ suit: Suits.DIAMONDS, rank: 6 })

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
    let deck: State

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

      deck.tableau = {
        [laneSpace1.id]: laneSpace1,
        [laneSpace2.id]: laneSpace2
      }
      deck.foundations = {
        [foundationSpace.id]: foundationSpace
      }
    })

    it('should hint that a card should be worried back if its parent can marry one in the tableaux', () => {
      deck.tableau[untouchedTopCard.id] = untouchedTopCard

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
