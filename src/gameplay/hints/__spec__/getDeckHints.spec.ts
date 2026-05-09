import { DEAL_CARD_ID, Suits } from '@/constants'
import { Card } from '@/types/Card'
import { State } from '@/store/state'
import { createCard } from '@/models/Card'
import { getDeckHints } from '../getDeckHints'
import { createDeckState } from './__helpers__/createDeckState'
import { isBuildable } from '@/gameplay/rules/isBuildable'
import { isAce } from '@/gameplay/rules/isAce'
import { hasSameSuitAfterPromotion } from '@/gameplay/rules/hasSameSuitAfterPromotion'

function createFoundationSpace (suit: string): Card {
  return createCard({
    suit,
    promoted: true,
    revealed: true,
    rules: [isBuildable, isAce, hasSameSuitAfterPromotion],
    type: 'FoundationSpace'
  })
}

describe('Hint: getDeckHints', () => {
  it('should return the DEAL_CARD hint when a dealable card can be placed on a target', () => {
    const foundationSpace: Card = createFoundationSpace(Suits.SPADES)
    const aceOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 0 })

    aceOfSpades.revealed = true

    const deck: State = createDeckState({
      foundations: { [foundationSpace.id]: foundationSpace },
      tableau: {},
      cards: { [aceOfSpades.id]: aceOfSpades }
    })

    // Put the ace in the stock so getDealableCards returns it
    deck.stock = [aceOfSpades]
    deck.dealIndex = -1
    deck.dealSpace.child = aceOfSpades

    const allCards: Card[] = [foundationSpace]

    expect(getDeckHints(allCards, [], deck)).toEqual([
      expect.arrayContaining([DEAL_CARD_ID])
    ])
  })

  it('should return an empty array when there are no cards in the stock', () => {
    const foundationSpace: Card = createFoundationSpace(Suits.HEARTS)

    const deck: State = createDeckState({
      foundations: { [foundationSpace.id]: foundationSpace },
      tableau: {},
      cards: {}
    })

    deck.stock = []
    deck.dealIndex = -1

    const allCards: Card[] = [foundationSpace]

    expect(getDeckHints(allCards, [], deck)).toEqual([])
  })

  it('should return an empty array when no dealable card can be placed on any target', () => {
    const foundationSpace: Card = createFoundationSpace(Suits.CLUBS)
    // A six of spades cannot be placed on a foundation space (not an ace)
    const sixOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 5 })

    sixOfSpades.revealed = true

    const deck: State = createDeckState({
      foundations: { [foundationSpace.id]: foundationSpace },
      tableau: {},
      cards: { [sixOfSpades.id]: sixOfSpades }
    })

    deck.stock = [sixOfSpades]
    deck.dealIndex = -1
    deck.dealSpace.child = sixOfSpades

    const allCards: Card[] = [foundationSpace]

    expect(getDeckHints(allCards, [], deck)).toEqual([])
  })
})
