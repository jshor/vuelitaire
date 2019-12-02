import hasAlternatingColorBeforePromotion from '../hasAlternatingColorBeforePromotion'
import Card from '@/models/Card'
import { Suits } from '@/constants'

describe('Rule: hasAlternatingColorBeforePromotion', () => {
  it('should return false if the target is not promoted and colors are not alternating', () => {
    const card: Card = new Card(Suits.HEARTS, 0)
    const target: Card = new Card(Suits.HEARTS, 1)

    target.promoted = false

    expect(hasAlternatingColorBeforePromotion(card, target)).toBe(false)
  })

  it('should return true if the target is not promoted but colors are alternating', () => {
    const card: Card = new Card(Suits.HEARTS, 0)
    const target: Card = new Card(Suits.SPADES, 1)

    target.promoted = false

    expect(hasAlternatingColorBeforePromotion(card, target)).toBe(true)
  })

  it('should return true if the target is promoted', () => {
    const card: Card = new Card(Suits.HEARTS, 0)
    const target: Card = new Card(Suits.SPADES, 1)

    target.promoted = true

    expect(hasAlternatingColorBeforePromotion(card, target)).toBe(true)
  })
})
