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

  it('should return false when there is no child card', () => {
    const parent: Card = createCard({ suit: Suits.DIAMONDS, rank: 3 })

    expect(isSequential(parent, undefined)).toEqual(false)
  })

  describe('when the parent is promoted', () => {
    it('should return true if the child rank is exactly one above the parent rank', () => {
      const parent: Card = createCard({ suit: Suits.DIAMONDS, rank: 3, promoted: true })
      const child: Card = createCard({ suit: Suits.DIAMONDS, rank: 4 })

      expect(isSequential(parent, child)).toEqual(true)
    })

    it('should return false if the child rank is not exactly one above the parent rank', () => {
      const parent: Card = createCard({ suit: Suits.DIAMONDS, rank: 3, promoted: true })
      const child: Card = createCard({ suit: Suits.DIAMONDS, rank: 2 })

      expect(isSequential(parent, child)).toEqual(false)
    })
  })
})
