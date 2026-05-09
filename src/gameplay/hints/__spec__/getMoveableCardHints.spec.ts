import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { State } from '@/store/state'
import { createCard } from '@/models/Card'
import { getMoveableCardHints } from '../getMoveableCardHints'
import { createDeckState } from './__helpers__/createDeckState'
import { isBuildable } from '@/gameplay/rules/isBuildable'
import { isKing } from '@/gameplay/rules/isKing'
import { hasSameSuitAfterPromotion } from '@/gameplay/rules/hasSameSuitAfterPromotion'
import { isAce } from '@/gameplay/rules/isAce'

describe('Hint: getMoveableCardHints', () => {
  function createLaneSpace() {
    return createCard({
      revealed: true,
      rules: [isBuildable, isKing],
      type: 'LaneSpace'
    })
  }

  const sixOfDiamonds: Card = createCard({ suit: Suits.DIAMONDS, rank: 5 })
  const sevenOfClubs: Card = createCard({ suit: Suits.CLUBS, rank: 6 })
  const sevenOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 6 })
  const aceOfHearts: Card = createCard({ suit: Suits.HEARTS, rank: 0 })
  const kingOfSpades: Card = createCard({ suit: Suits.SPADES, rank: 12 })
  const laneSpace: Card = createLaneSpace()
  const foundationSpace: Card = createCard({
    suit: Suits.HEARTS,
    promoted: true,
    revealed: true,
    rules: [isBuildable, isAce, hasSameSuitAfterPromotion],
    type: 'FoundationSpace'
  })
  const cards: Card[] = [
    sixOfDiamonds,
    sevenOfClubs,
    sevenOfSpades,
    aceOfHearts,
    kingOfSpades,
    laneSpace,
    foundationSpace
  ]
  const deck: State = createDeckState({
    foundations: {
      [foundationSpace.id]: foundationSpace
    },
    tableau: {
      [laneSpace.id]: laneSpace
    },
    cards: {
      [sixOfDiamonds.id]: sixOfDiamonds,
      [sevenOfClubs.id]: sevenOfClubs,
      [sevenOfSpades.id]: sevenOfSpades,
      [aceOfHearts.id]: aceOfHearts,
      [kingOfSpades.id]: kingOfSpades
    },

  })
  let hints: string[][]

  cards.forEach((card: Card): void => {
    card.revealed = true
    card.parent = createCard({ suit: Suits.DIAMONDS, rank: 2 })
  })

  beforeEach(() => {
    hints = getMoveableCardHints(deck, cards)
  })

  it('should generate exactly four hints', () => {
    expect(hints).toHaveLength(4)
  })

  it('should hint the 6 of Diamonds to be placed onto the 7 of Clubs', () => {
    expect(hints).toEqual(expect.arrayContaining([
      expect.arrayContaining([sixOfDiamonds.id, sevenOfClubs.id])
    ]))
  })

  it('should hint the Ace of Hearts to be placed onto the empty foundation space', () => {
    expect(hints).toEqual(expect.arrayContaining([
      expect.arrayContaining([aceOfHearts.id, foundationSpace.id])
    ]))
  })

  describe('hasRankingParent filtering', () => {
    it('should include a hint when a card has a parent in the list and parent rank differs from target rank', () => {
      const parent: Card = createCard({ suit: Suits.CLUBS, rank: 9 })
      const child: Card = createCard({ suit: Suits.DIAMONDS, rank: 7 })
      const target: Card = createCard({ suit: Suits.SPADES, rank: 8 })

      parent.revealed = true
      child.revealed = true
      target.revealed = true
      parent.parent = createCard({ suit: Suits.HEARTS, rank: 10 })
      target.parent = createCard({ suit: Suits.HEARTS, rank: 10 })

      // link parent and child so hasRankingParent can find parent via c.child === child
      parent.child = child
      child.parent = parent

      const playableCards: Card[] = [parent, child, target]
      const state: State = createDeckState()
      const result = getMoveableCardHints(state, playableCards)

      // parent.rank (9) !== target.rank (8), so hint should be included
      expect(result).toEqual(expect.arrayContaining([
        expect.arrayContaining([child.id, target.id])
      ]))
    })

    it('should exclude a hint when a card has a parent in the list and parent rank matches target rank', () => {
      const parent: Card = createCard({ suit: Suits.CLUBS, rank: 8 })
      const child: Card = createCard({ suit: Suits.DIAMONDS, rank: 7 })
      const target: Card = createCard({ suit: Suits.SPADES, rank: 8 })

      parent.revealed = true
      child.revealed = true
      target.revealed = true
      parent.parent = createCard({ suit: Suits.HEARTS, rank: 10 })
      target.parent = createCard({ suit: Suits.HEARTS, rank: 10 })

      // link parent and child so hasRankingParent can find parent via c.child === child
      parent.child = child
      child.parent = parent

      const playableCards: Card[] = [parent, child, target]
      const state: State = createDeckState()
      const result = getMoveableCardHints(state, playableCards)

      // parent.rank (8) === target.rank (8), so hint should be excluded
      expect(result).not.toEqual(expect.arrayContaining([
        expect.arrayContaining([child.id, target.id])
      ]))
    })
  })
})
