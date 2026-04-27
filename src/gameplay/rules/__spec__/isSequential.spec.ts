import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { isSequential } from '../isSequential'

describe('Rule: isSequential', () => {
  it('should return true if the parent card is exactly one rank above the child card', () => {
    const parent: Card = createCard({ suit: Suits.DIAMONDS, rank: 3 })
    const child: Card = createCard({ suit: Suits.SPADES, rank: 2 })

    expect(isSequential(parent, child)).toEqual(true)
  })

  it('should return false if the parent card is the same rank as the child card', () => {
    const parent: Card = createCard({ suit: Suits.DIAMONDS, rank: 3 })
    const child: Card = createCard({ suit: Suits.SPADES, rank: 3 })

    expect(isSequential(parent, child)).toEqual(false)
  })

  it('should return false if the parent card is more than one rank above the child card', () => {
    const parent: Card = createCard({ suit: Suits.DIAMONDS, rank: 3 })
    const child: Card = createCard({ suit: Suits.SPADES, rank: 1 })

    expect(isSequential(parent, child)).toEqual(false)
  })

  it('should return false if the parent card is more than one rank below the child card', () => {
    const parent: Card = createCard({ suit: Suits.DIAMONDS, rank: 1 })
    const child: Card = createCard({ suit: Suits.SPADES, rank: 5 })

    expect(isSequential(parent, child)).toEqual(false)
  })
})
