import hasSameSuitAfterPromotion from '../hasSameSuitAfterPromotion'
import Card from '../../../store/models/Card'
import { Suits } from '../../../constants'

describe('Rule: hasSameSuitAfterPromotion', () => {
  it('should return true if the card is not promoted', () => {
    const card = new Card(Suits.SPADES, 1)
    const target = new Card(Suits.SPADES, 0)

    card.promoted = false

    expect(hasSameSuitAfterPromotion(card, target)).toBe(true)
  })

  it('should return true if the suits of the card and its target match', () => {
    const card = new Card(Suits.SPADES, 1)
    const target = new Card(Suits.SPADES, 0)

    card.promoted = true

    expect(hasSameSuitAfterPromotion(card, target)).toBe(true)
  })

  it('should return false if the suit of the card does not match its target', () => {
    const card = new Card(Suits.SPADES, 1)
    const target = new Card(Suits.HEARTS, 0)

    card.promoted = true

    expect(hasSameSuitAfterPromotion(card, target)).toBe(false)
  })

  it('should return false if a child is present on the target', () => {
    const card = new Card(Suits.SPADES, 1)
    const child = new Card(Suits.HEARTS, 0)
    const target = new Card(Suits.SPADES, 0)

    card.promoted = true
    target.child = child

    expect(hasSameSuitAfterPromotion(card, target)).toBe(false)
  })
})
