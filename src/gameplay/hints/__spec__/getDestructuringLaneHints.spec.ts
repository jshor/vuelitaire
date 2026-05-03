import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { State } from '@/store/state'
import { createCard } from '@/models/Card'
import { getDestructuringLaneHints } from '../getDestructuringLaneHints'
import { createDeckState } from './__helpers__/createDeckState'
import { isBuildable } from '@/gameplay/rules/isBuildable'
import { isAce } from '@/gameplay/rules/isAce'
import { hasSameSuitAfterPromotion } from '@/gameplay/rules/hasSameSuitAfterPromotion'

function makePlayable (cards: Card[]): void {
  cards.forEach((card: Card): void => {
    card.revealed = true
  })
}

function createFoundationSpace(suit: string): Card {
  return createCard({
    suit,
    promoted: true,
    revealed: true,
    rules: [isBuildable, isAce, hasSameSuitAfterPromotion],
    type: 'FoundationSpace'
  })
}

describe('getDestructuringLaneHints()', () => {
  it.skip('should create a hint for making a five of hearts promotable', () => {
    const foundation: Card = createFoundationSpace(Suits.SPADES)
    const aceOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 0 }) // promoted
    const twoOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 1 }) // card to promote
    const aceOfHearts: Card = createCard({ suit: Suits.HEARTS, rank: 0 }) // card blocking the two of spades from promotion
    const twoOfClubs: Card = createCard({ suit: Suits.CLUBS, rank: 1 }) // alternate card to move the ace of hearts onto
    const deck: State = createDeckState({
      foundations: {
        [foundation.id]: foundation
      },
      tableau: {},
      cards: {
        [aceOfSpades.id]: aceOfSpades,
        [twoOfSpades.id]: twoOfSpades,
        [aceOfHearts.id]: aceOfHearts,
        [twoOfClubs.id]: twoOfClubs
      }
    })
    const cards = Object.values(deck.cards)

    makePlayable(cards)

    foundation.child = aceOfSpades
    twoOfSpades.child = aceOfHearts
    aceOfSpades.promoted = true

    const hints: string[][] = getDestructuringLaneHints(deck, cards)

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([aceOfHearts.id, twoOfClubs.id])
      ])
    )
  })

  it('should not create a hint if there is no alternate card to destructure the lane to', () => {
    const foundation: Card = createFoundationSpace(Suits.SPADES)
    const aceOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 0 }) // promoted
    const twoOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 1 }) // card to promote
    const aceOfHearts: Card = createCard({ suit: Suits.HEARTS, rank: 0 }) // card blocking the Ace of spades from promotion
    const deck: State = createDeckState({
      foundations: {
        [foundation.id]: foundation
      },
      tableau: {},
      cards: {
        [aceOfSpades.id]: aceOfSpades,
        [twoOfSpades.id]: twoOfSpades,
        [aceOfHearts.id]: aceOfHearts
      }
    })
    const cards = Object.values(deck.cards)

    makePlayable(cards)

    foundation.child = aceOfSpades
    twoOfSpades.child = aceOfHearts
    aceOfSpades.promoted = true

    const hints: string[][] = getDestructuringLaneHints(deck, cards)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([aceOfHearts.id])
      ])
    )
  })

  it('should not create a hint if there are no cards blocked from promotion', () => {
    const foundation: Card = createFoundationSpace(Suits.SPADES)
    const aceOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 0 }) // promoted
    const twoOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 1 }) // card to promote
    const deck: State = createDeckState({
      foundations: {
        [foundation.id]: foundation
      },
      tableau: {},
      cards: {
        [aceOfSpades.id]: aceOfSpades,
        [twoOfSpades.id]: twoOfSpades
      }
    })
    const cards = Object.values(deck.cards)

    makePlayable(cards)

    foundation.child = aceOfSpades
    aceOfSpades.promoted = true

    const hints: string[][] = getDestructuringLaneHints(deck, cards)

    expect(hints).toHaveLength(0)
  })
})
