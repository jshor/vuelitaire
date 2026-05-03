import { Suits } from '@/constants'
import { State } from '@/store/state'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { getDealableCards } from '../getDealableCards'

describe('getDealableCards()', () => {
  const stock = Array(9)
    .fill(null)
    .map(() => createCard({ suit: Suits.DIAMONDS, rank: 1 }))

  const getDeckState = (state: { stock?: Card[]; dealCount?: number } = {}): State => {
    const { dealCount = 1, ...rest } = state
    return {
      cards: {},
      stock,
      dealIndex: -1,
      dealSpace: createCard({
        type: 'DealSpace',
        revealed: true,
        rules: [() => false] // do not accept any cards
      }),
      settings: { dealCount },
      ...rest,
    } as unknown as State
  }

  describe('when the deal count is 1', () => {
    it('should return a list of all of the cards in the stock', () => {
      const result = getDealableCards(getDeckState())

      expect.assertions(stock.length)
      stock.forEach((card) => {
        expect(result).toContain(card)
      })
    })
  })

  describe('when the deal count is 3', () => {
    it('should return a list containing every third card from the reversed stock', () => {
      const result = getDealableCards(getDeckState({ dealCount: 3 }))

      expect(result).toContain(stock[0])
      expect(result).toContain(stock[3])
      expect(result).toContain(stock[6])
    })

    it('should return the first card in the stock, regardless of whether its count divides dealCount', () => {
      const result = getDealableCards(getDeckState({
        stock: stock.concat(createCard({ suit: Suits.DIAMONDS, rank: 1 })), // 10 cards, not divisible by 3
        dealCount: 3
      }))

      expect(result).toContain(stock[0])
    })

    it('should contain every third card from the reversed stock (when cycling back)', () => {
      const result = getDealableCards(getDeckState({ dealCount: 3 }))

      // reversed stock: [stock[8], stock[7], ..., stock[0]]
      // every 3rd position (index 2, 5, 8) plus last gives stock[6], stock[3], stock[0]
      expect(result).toContain(stock[0])
      expect(result).toContain(stock[3])
      expect(result).toContain(stock[6])
      expect(result).not.toContain(stock[1])
      expect(result).not.toContain(stock[2])
    })
  })
})
