import { Suits } from '@/constants'
import { ICard } from '@/interfaces/ICard'
import { State } from '@/store/state'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { LaneSpace } from '@/types/LaneSpace'
import { createLaneSpace } from '@/models/LaneSpace'
import { getLaneCreationHints } from '../getLaneCreationHints'
import { createDeckState } from './__helpers__/createDeckState'

describe('Lane creation', () => {
  it('should return multiple hints if multiple kings can be moved to a space', () => {
    const space: ICard = createLaneSpace()
    const kingOfHearts: ICard = createCard({ suit: Suits.HEARTS, rank: 12 })
    const kingOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 12 })
    const deck: State = createDeckState({
      foundations: {},
      tableau: {
        [space.id]: space
      },
      regular: {
        [kingOfHearts.id]: kingOfHearts,
        [kingOfSpades.id]: kingOfSpades
      },
      unrevealedCount: 52
    })
    const cards = Object.values(deck.cards)

    const hints: string[][] = getLaneCreationHints(cards, [kingOfHearts, kingOfSpades], deck)

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space.id]),
        expect.arrayContaining([kingOfSpades.id, space.id])
      ])
    )
  })

  it('should return multiple hints if one king can be moved to multiple spaces', () => {
    const space1: ICard = createLaneSpace()
    const space2: ICard = createLaneSpace()
    const kingOfHearts: ICard = createCard({ suit: Suits.HEARTS, rank: 12 })
    const deck: State = createDeckState({
      foundations: {},
      tableau: {
        [space1.id]: space1,
        [space2.id]: space2
      },
      regular: {
        [kingOfHearts.id]: kingOfHearts
      },
      unrevealedCount: 52
    })
    const cards = Object.values(deck.cards)

    const hints: string[][] = getLaneCreationHints(cards, [kingOfHearts], deck)

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space1.id]),
        expect.arrayContaining([kingOfHearts.id, space2.id])
      ])
    )
  })

  it('should return multiple hints if multiple kings can be moved to multiple spaces', () => {
    const space1: ICard = createLaneSpace()
    const space2: ICard = createLaneSpace()
    const kingOfHearts: ICard = createCard({ suit: Suits.HEARTS, rank: 12 })
    const kingOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 12 })
    const deck: State = createDeckState({
      foundations: {},
      tableau: {
        [space1.id]: space1,
        [space2.id]: space2
      },
      regular: {
        [kingOfHearts.id]: kingOfHearts,
        [kingOfSpades.id]: kingOfSpades
      },
      unrevealedCount: 52
    })
    const cards = Object.values(deck.cards)

    const hints: string[][] = getLaneCreationHints(cards, [kingOfHearts, kingOfSpades], deck)

    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space1.id]),
        expect.arrayContaining([kingOfHearts.id, space2.id]),
        expect.arrayContaining([kingOfSpades.id, space1.id]),
        expect.arrayContaining([kingOfSpades.id, space2.id])
      ])
    )
  })

  it('should not hint that a king should be moved to a space if the space already has a child', () => {
    const space: ICard = createLaneSpace()
    const kingOfHearts: ICard = createCard({ suit: Suits.HEARTS, rank: 12 })
    const kingOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 12 })
    const deck: State = createDeckState({
      foundations: {},
      tableau: {
        [space.id]: space
      },
      regular: {
        [kingOfHearts.id]: kingOfHearts,
        [kingOfSpades.id]: kingOfSpades
      },
      unrevealedCount: 52
    })
    const cards = Object.values(deck.cards)

    space.child = kingOfSpades

    const hints: string[][] = getLaneCreationHints(cards, [kingOfHearts, kingOfSpades], deck)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space.id])
      ])
    )
  })

  it('should not hint that a king should be moved to a space if the king has a child', () => {
    const space: ICard = createLaneSpace()
    const kingOfHearts: ICard = createCard({ suit: Suits.HEARTS, rank: 12 })
    const queenOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 11 })
    const deck: State = createDeckState({
      foundations: {},
      tableau: {
        [space.id]: space
      },
      regular: {
        [kingOfHearts.id]: kingOfHearts,
        [queenOfSpades.id]: queenOfSpades
      },
      unrevealedCount: 52
    })
    const cards = Object.values(deck.cards)

    kingOfHearts.child = queenOfSpades

    const hints: string[][] = getLaneCreationHints(cards, [kingOfHearts, queenOfSpades], deck)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([kingOfHearts.id, space.id])
      ])
    )
  })

  it('should not hint that a card of another rank can be moved to a space', () => {
    const space: ICard = createLaneSpace()
    const kingOfHearts: ICard = createCard({ suit: Suits.HEARTS, rank: 12 })
    const queenOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 11 })
    const deck: State = createDeckState({
      foundations: {},
      tableau: {
        [space.id]: space
      },
      regular: {
        [kingOfHearts.id]: kingOfHearts,
        [queenOfSpades.id]: queenOfSpades
      },
      unrevealedCount: 52
    })
    const cards = Object.values(deck.cards)

    const hints: string[][] = getLaneCreationHints(cards, [kingOfHearts, queenOfSpades], deck)

    expect(hints).not.toEqual(
      expect.arrayContaining([
        expect.arrayContaining([queenOfSpades.id, space.id])
      ])
    )
  })
})
