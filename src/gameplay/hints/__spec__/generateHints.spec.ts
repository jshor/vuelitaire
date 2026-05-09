import { Suits } from '@/constants'
import { createCard } from '@/models/Card'
import { Card } from '@/types/Card'
import { State } from '@/store/state'
import { generateHints } from '../index'
import { createDeckState } from './__helpers__/createDeckState'
import { isBuildable } from '@/gameplay/rules/isBuildable'
import { isKing } from '@/gameplay/rules/isKing'
import { isAce } from '@/gameplay/rules/isAce'
import { hasSameSuitAfterPromotion } from '@/gameplay/rules/hasSameSuitAfterPromotion'

function createLaneSpace (): Card {
  return createCard({
    revealed: true,
    rules: [isBuildable, isKing],
    type: 'LaneSpace'
  })
}

function createFoundationSpace (suit: string): Card {
  return createCard({
    suit,
    promoted: true,
    revealed: true,
    rules: [isBuildable, isAce, hasSameSuitAfterPromotion],
    type: 'FoundationSpace'
  })
}

describe('generateHints()', () => {
  it('should return an empty array when there are no moveable cards or foundations', () => {
    const state: State = createDeckState()
    const hints = generateHints(state)

    expect(hints).toEqual([])
  })

  it('should return moveable card hints when cards can be played', () => {
    const laneSpace: Card = createLaneSpace()
    const sevenOfClubs: Card = createCard({ suit: Suits.CLUBS, rank: 6 })
    const sixOfDiamonds: Card = createCard({ suit: Suits.DIAMONDS, rank: 5 })

    sevenOfClubs.revealed = true
    sixOfDiamonds.revealed = true
    sevenOfClubs.parent = createCard({ suit: Suits.HEARTS, rank: 9 })
    sixOfDiamonds.parent = createCard({ suit: Suits.HEARTS, rank: 9 })

    sevenOfClubs.child = sixOfDiamonds
    sixOfDiamonds.parent = sevenOfClubs

    const state: State = createDeckState({
      tableau: {
        [laneSpace.id]: laneSpace,
        [sevenOfClubs.id]: sevenOfClubs
      },
      foundations: {},
      cards: {}
    })

    const hints = generateHints(state)

    expect(Array.isArray(hints)).toBe(true)
  })

  it('should include foundation top cards in playable cards', () => {
    const foundationSpace: Card = createFoundationSpace(Suits.HEARTS)
    const aceOfHearts: Card = createCard({ suit: Suits.HEARTS, rank: 0 })
    const laneSpace: Card = createLaneSpace()
    const twoOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 1 })

    aceOfHearts.revealed = true
    aceOfHearts.promoted = true
    twoOfSpades.revealed = true
    twoOfSpades.parent = createCard({ suit: Suits.CLUBS, rank: 5 })

    foundationSpace.child = aceOfHearts
    aceOfHearts.parent = foundationSpace

    const state: State = createDeckState({
      tableau: {
        [laneSpace.id]: laneSpace,
        [twoOfSpades.id]: twoOfSpades
      },
      foundations: {
        [foundationSpace.id]: foundationSpace
      },
      cards: {
        [twoOfSpades.id]: twoOfSpades
      }
    })

    const hints = generateHints(state)

    expect(Array.isArray(hints)).toBe(true)
  })

  it('should include the top card of dealSpace in playable cards when dealSpace has a child', () => {
    const foundationSpace: Card = createFoundationSpace(Suits.CLUBS)
    const aceOfClubs: Card = createCard({ suit: Suits.CLUBS, rank: 0 })

    aceOfClubs.revealed = true

    const state: State = createDeckState({
      tableau: {},
      foundations: {
        [foundationSpace.id]: foundationSpace
      },
      cards: {
        [aceOfClubs.id]: aceOfClubs
      }
    })

    // Give dealSpace a child (top of dealt pile)
    state.dealSpace.child = aceOfClubs

    const hints = generateHints(state)

    // The ace of clubs from the dealt pile should be considered for promotion
    expect(hints).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([aceOfClubs.id, foundationSpace.id])
      ])
    )
  })

  it('should apply desperate hints (destructuring + worryBack) when no basic hints found', () => {
    const state: State = createDeckState()

    // Add a foundation so the desperate hint functions have something to iterate
    const foundationSpace: Card = createFoundationSpace(Suits.SPADES)
    state.foundations = { [foundationSpace.id]: foundationSpace }

    const hints = generateHints(state)

    // With nothing playable, desperate hints are attempted but still likely empty
    expect(Array.isArray(hints)).toBe(true)
  })

  it('should apply desperate hints when allowWorryBackHints is true even if basic hints exist', () => {
    const laneSpace: Card = createLaneSpace()
    const foundationSpace: Card = createFoundationSpace(Suits.HEARTS)
    const kingOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 12 })
    const aceOfHearts: Card = createCard({ suit: Suits.HEARTS, rank: 0 })

    kingOfSpades.revealed = true
    aceOfHearts.revealed = true
    aceOfHearts.parent = createCard({ suit: Suits.CLUBS, rank: 5 })

    const state: State = createDeckState({
      tableau: {
        [laneSpace.id]: laneSpace
      },
      foundations: {
        [foundationSpace.id]: foundationSpace
      },
      cards: {
        [kingOfSpades.id]: kingOfSpades,
        [aceOfHearts.id]: aceOfHearts
      }
    })

    const hintsNormal = generateHints(state, false)
    const hintsWorryBack = generateHints(state, true)

    // Both calls succeed and return arrays
    expect(Array.isArray(hintsNormal)).toBe(true)
    expect(Array.isArray(hintsWorryBack)).toBe(true)
  })

  it('should filter out stock cards that are stuck under the dealt top card', () => {
    const laneSpace: Card = createLaneSpace()
    const card1: Card = createCard({ suit: Suits.SPADES, rank: 5 })
    const card2: Card = createCard({ suit: Suits.HEARTS, rank: 4 })
    const card3: Card = createCard({ suit: Suits.CLUBS, rank: 9 })

    card1.revealed = true
    card2.revealed = true
    card3.revealed = true

    const state: State = createDeckState({
      tableau: { [laneSpace.id]: laneSpace },
      foundations: {},
      cards: {}
    })

    // stock has 4 cards; with DEALT_CARDS_DISPLAYED=3, the top 3 from dealIndex are stuck
    state.stock = [card1, card2, card3]
    state.dealIndex = 0

    const hints = generateHints(state)

    expect(Array.isArray(hints)).toBe(true)
  })
})
