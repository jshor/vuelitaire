import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { hasSameSuitAfterPromotion } from '../hasSameSuitAfterPromotion'

describe('Rule: hasSameSuitAfterPromotion', () => {
  it('should return true if the card is not promoted', () => {
    const card: Card = createCard({ suit: Suits.SPADES, rank: 1 })
    const target: Card = createCard({ suit: Suits.SPADES, rank: 0 })

    card.promoted = false

    expect(hasSameSuitAfterPromotion(card, target)).toBe(true)
  })

  it('should return true if the suits of the card and its target match', () => {
    const card: Card = createCard({ suit: Suits.SPADES, rank: 1 })
    const target: Card = createCard({ suit: Suits.SPADES, rank: 0 })

    card.promoted = true

    expect(hasSameSuitAfterPromotion(card, target)).toBe(true)
  })

  it('should return false if the suit of the card does not match its target', () => {
    const card: Card = createCard({ suit: Suits.SPADES, rank: 1 })
    const target: Card = createCard({ suit: Suits.HEARTS, rank: 0 })

    card.promoted = true

    expect(hasSameSuitAfterPromotion(card, target)).toBe(false)
  })

  it('should return false if a child is present on the target', () => {
    const card: Card = createCard({ suit: Suits.SPADES, rank: 1 })
    const child: Card = createCard({ suit: Suits.HEARTS, rank: 0 })
    const target: Card = createCard({ suit: Suits.SPADES, rank: 0 })

    card.promoted = true
    target.child = child

    expect(hasSameSuitAfterPromotion(card, target)).toBe(false)
  })
})
