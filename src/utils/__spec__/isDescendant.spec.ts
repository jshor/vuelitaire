import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { isDescendant } from '../isDescendant'

describe('getLineage()', () => {
  const cardA: Card = createCard({ suit: Suits.DIAMONDS, rank: 1 })
  const cardB: Card = createCard({ suit: Suits.DIAMONDS, rank: 1 })
  const cardC: Card = createCard({ suit: Suits.DIAMONDS, rank: 1 })
  const cardD: Card = createCard({ suit: Suits.DIAMONDS, rank: 1 })

  cardA.child = cardB
  cardB.child = cardC
  cardC.child = cardD

  it('should return true for all of its descendants', () => {
    expect(isDescendant(cardA, cardB.id)).toBe(true)
    expect(isDescendant(cardA, cardC.id)).toBe(true)
    expect(isDescendant(cardA, cardD.id)).toBe(true)
  })

  it('should return false for an ancestor card', () => {
    expect(isDescendant(cardC, cardB.id)).toBe(false)
  })
})
