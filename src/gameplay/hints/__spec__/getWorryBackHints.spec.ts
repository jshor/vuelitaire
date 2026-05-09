import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { State } from '@/store/state'
import { createCard } from '@/models/Card'
import { getWorryBackHints } from '../getWorryBackHints'
import { createDeckState } from './__helpers__/createDeckState'
import { isBuildable } from '@/gameplay/rules/isBuildable'
import { isKing } from '@/gameplay/rules/isKing'
import { hasSameSuitAfterPromotion } from '@/gameplay/rules/hasSameSuitAfterPromotion'
import { isAce } from '@/gameplay/rules/isAce'

describe('Hint: getWorryBackHints', () => {
  function createLaneSpace() {
    return createCard({
      revealed: true,
      rules: [isBuildable, isKing],
      type: 'LaneSpace'
    })
  }

  const laneSpace1: Card = createLaneSpace()
  const laneSpace2: Card = createLaneSpace()
  const foundationSpace: Card = createCard({
    suit: Suits.SPADES,
    promoted: true,
    revealed: true,
    rules: [isBuildable, isAce, hasSameSuitAfterPromotion],
    type: 'FoundationSpace'
  })

  const unrevealedParent: Card = createCard({ suit: Suits.SPADES, rank: 11 })
  const untouchedTopCard: Card = createCard({ suit: Suits.HEARTS, rank: 6 })
  const receivableTopCard: Card = createCard({ suit: Suits.DIAMONDS, rank: 8 })
  const promotedChild: Card = createCard({ suit: Suits.SPADES, rank: 7 })
  const promotedParent: Card = createCard({ suit: Suits.SPADES, rank: 6 })
  const unplayedCard: Card = createCard({ suit: Suits.DIAMONDS, rank: 6 })

  beforeEach(() => {
    untouchedTopCard.revealed =
    receivableTopCard.revealed =
    unplayedCard.revealed =
    promotedParent.promoted =
    promotedChild.promoted = true
  })

  const cards: Card[] = [
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

      const hints: string[][] = getWorryBackHints(cards, cards, deck)

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
      deck.stock = [unplayedCard]

      const hints: string[][] = getWorryBackHints(cards, cards, deck)

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
      deck.stock = [unplayedCard]

      const hints: string[][] = getWorryBackHints(cards, cards, deck)

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
