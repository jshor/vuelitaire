import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { isKing } from '../isKing'

describe('Rule: isKing', () => {
  const parent: Card = null!

  it('should return true if the child card is a King', () => {
    const child: Card = createCard({ suit: Suits.DIAMONDS, rank: 12 })

    expect(isKing(parent, child)).toEqual(true)
  })

  it('should return false if the child card is not a King', () => {
    const child: Card = createCard({ suit: Suits.DIAMONDS, rank: 1 })

    expect(isKing(parent, child)).toEqual(false)
  })
})
