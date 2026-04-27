import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { hasAlternatingColorBeforePromotion } from '../hasAlternatingColorBeforePromotion'

describe('Rule: hasAlternatingColorBeforePromotion', () => {
  it('should return false if the target is not promoted and colors are not alternating', () => {
    const card: Card = createCard({ suit: Suits.HEARTS, rank: 0 })
    const target: Card = createCard({ suit: Suits.HEARTS, rank: 1 })

    target.promoted = false

    expect(hasAlternatingColorBeforePromotion(card, target)).toBe(false)
  })

  it('should return true if the target is not promoted but colors are alternating', () => {
    const card: Card = createCard({ suit: Suits.HEARTS, rank: 0 })
    const target: Card = createCard({ suit: Suits.SPADES, rank: 1 })

    target.promoted = false

    expect(hasAlternatingColorBeforePromotion(card, target)).toBe(true)
  })

  it('should return true if the target is promoted', () => {
    const card: Card = createCard({ suit: Suits.HEARTS, rank: 0 })
    const target: Card = createCard({ suit: Suits.SPADES, rank: 1 })

    target.promoted = true

    expect(hasAlternatingColorBeforePromotion(card, target)).toBe(true)
  })
})
