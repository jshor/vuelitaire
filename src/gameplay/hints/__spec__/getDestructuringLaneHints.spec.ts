import { Suits } from '@/constants'
import { ICard } from '@/interfaces/ICard'
import { State } from '@/store/state'
import { createCard } from '@/models/Card'
import { createFoundationSpace } from '@/models/FoundationSpace'
import { getDestructuringLaneHints } from '../getDestructuringLaneHints'
import { createDeckState } from './__helpers__/createDeckState'

function makePlayable (cards: ICard[]): void {
  cards.forEach((card: ICard): void => {
    card.revealed = true
  })
}

describe('getDestructuringLaneHints()', () => {
  it.skip('should create a hint for making a five of hearts promotable', () => {
    const foundation: ICard = createFoundationSpace()
    const aceOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 0 }) // promoted
    const twoOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 1 }) // card to promote
    const aceOfHearts: ICard = createCard({ suit: Suits.HEARTS, rank: 0 }) // card blocking the two of spades from promotion
    const twoOfClubs: ICard = createCard({ suit: Suits.CLUBS, rank: 1 }) // alternate card to move the ace of hearts onto
    const deck: State = createDeckState({
      foundations: {
        [foundation.id]: foundation
      },
      tableau: {},
      regular: {
        [aceOfSpades.id]: aceOfSpades,
        [twoOfSpades.id]: twoOfSpades,
        [aceOfHearts.id]: aceOfHearts,
        [twoOfClubs.id]: twoOfClubs
      },
      unrevealedCount: 0
    })
    const cards = Object.values(deck.cards)

    makePlayable(cards)

    foundation.child = aceOfSpades
    twoOfSpades.child = aceOfHearts
    aceOfSpades.promoted = true

    const hints: string[][] = getDestructuringLaneHints(cards, cards, deck)

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([aceOfHearts.id, twoOfClubs.id])
      ])
    )
  })

  it('should not create a hint if there is no alternate card to destructure the lane to', () => {
    const foundation: ICard = createFoundationSpace()
    const aceOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 0 }) // promoted
    const twoOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 1 }) // card to promote
    const aceOfHearts: ICard = createCard({ suit: Suits.HEARTS, rank: 0 }) // card blocking the Ace of spades from promotion
    const deck: State = createDeckState({
      foundations: {
        [foundation.id]: foundation
      },
      tableau: {},
      regular: {
        [aceOfSpades.id]: aceOfSpades,
        [twoOfSpades.id]: twoOfSpades,
        [aceOfHearts.id]: aceOfHearts
      },
      unrevealedCount: 0
    })
    const cards = Object.values(deck.cards)

    makePlayable(cards)

    foundation.child = aceOfSpades
    twoOfSpades.child = aceOfHearts
    aceOfSpades.promoted = true

    const hints: string[][] = getDestructuringLaneHints(cards, cards, deck)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([aceOfHearts.id])
      ])
    )
  })

  it('should not create a hint if there are no cards blocked from promotion', () => {
    const foundation: ICard = createFoundationSpace()
    const aceOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 0 }) // promoted
    const twoOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 1 }) // card to promote
    const deck: State = createDeckState({
      foundations: {
        [foundation.id]: foundation
      },
      tableau: {},
      regular: {
        [aceOfSpades.id]: aceOfSpades,
        [twoOfSpades.id]: twoOfSpades
      },
      unrevealedCount: 0
    })
    const cards = Object.values(deck.cards)

    makePlayable(cards)

    foundation.child = aceOfSpades
    aceOfSpades.promoted = true

    const hints: string[][] = getDestructuringLaneHints(cards, cards, deck)

    expect(hints).toHaveLength(0)
  })
})
