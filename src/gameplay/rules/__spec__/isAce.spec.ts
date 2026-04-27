import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { isAce } from '../isAce'

describe('Rule: isSequential', () => {
  const parent: Card = null

  it('should return true if the child card is an Ace', () => {
    const child: Card = createCard({ suit: Suits.DIAMONDS, rank: 0 })

    expect(isAce(parent, child)).toEqual(true)
  })

  it('should return false if the child card is not an Ace', () => {
    const child: Card = createCard({ suit: Suits.DIAMONDS, rank: 1 })

    expect(isAce(parent, child)).toEqual(false)
  })
})
