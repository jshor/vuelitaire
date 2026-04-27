import { Suits } from '@/constants'
import { ICard } from '@/interfaces/ICard'
import { State } from '@/store/state'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { FoundationSpace } from '@/types/FoundationSpace'
import { createFoundationSpace } from '@/models/FoundationSpace'
import { LaneSpace } from '@/types/LaneSpace'
import { createLaneSpace } from '@/models/LaneSpace'
import { getMoveableCardHints } from '../getMoveableCardHints'
import { createDeckState } from './__helpers__/createDeckState'

describe('Hint: getMoveableCardHints', () => {
  const sixOfDiamonds: ICard = createCard({ suit: Suits.DIAMONDS, rank: 5 })
  const sevenOfClubs: ICard = createCard({ suit: Suits.CLUBS, rank: 6 })
  const sevenOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 6 })
  const aceOfHearts: ICard = createCard({ suit: Suits.HEARTS, rank: 0 })
  const kingOfSpades: ICard = createCard({ suit: Suits.SPADES, rank: 12 })
  const laneSpace: ICard = createLaneSpace()
  const foundationSpace: ICard = createFoundationSpace(Suits.HEARTS)
  const cards: ICard[] = [
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
    regular: {
      [sixOfDiamonds.id]: sixOfDiamonds,
      [sevenOfClubs.id]: sevenOfClubs,
      [sevenOfSpades.id]: sevenOfSpades,
      [aceOfHearts.id]: aceOfHearts,
      [kingOfSpades.id]: kingOfSpades
    },
    unrevealedCount: 52
  })
  let hints: string[][]

  cards.forEach((card: ICard): void => {
    card.revealed = true
    card.parent = createCard({ suit: Suits.DIAMONDS, rank: 2 })
  })

  beforeEach(() => {
    hints = getMoveableCardHints(cards, cards, deck)
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
})
