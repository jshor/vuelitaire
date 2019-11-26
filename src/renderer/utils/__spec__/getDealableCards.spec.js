import getDealableCards from '../getDealableCards'
import Card from '../../models/Card'
import { Suits } from '../../constants'

describe('getDealableCards()', () => {
  const stock = Array(9)
    .fill(null)
    .map(() => new Card(Suits.DIAMONDS, 1))

  describe('when the deal count is 1', () => {
    it('should return a list of all of the cards, including ones in the waste', () => {
      const waste = [
        new Card(Suits.DIAMONDS, 1),
        new Card(Suits.DIAMONDS, 1)
      ]
      const result = getDealableCards({
        stock,
        waste,
        dealCount: 1
      })

      expect.assertions(stock.length + waste.length)
      stock
        .concat(waste)
        .forEach(card => {
          expect(result).toContain(card)
        })
    })
  })
  describe('when the deal count is 3', () => {
    it('should return a list containing every third card from the reversed stock', () => {
      const result = getDealableCards({
        stock,
        waste: [],
        dealCount: 3
      })

      expect(result).toContain(stock[0])
      expect(result).toContain(stock[3])
      expect(result).toContain(stock[6])
    })

    it('should return the first card in the stock, regardless of whether its count is divisible by the dealCount', () => {
      const result = getDealableCards({
        stock: stock.concat(new Card(Suits.DIAMONDS, 1)), // 10 cards, not divisible by 3
        waste: [],
        dealCount: 3
      })

      expect(result).toContain(stock[0])
    })

    it('should contain viable waste cards (when returned to the stock)', () => {
      const waste = Array(6)
        .fill(null)
        .map(() => new Card(Suits.DIAMONDS, 1))

      const result = getDealableCards({
        stock,
        waste,
        dealCount: 3
      })

      expect(result).toContain(waste[2])
      expect(result).toContain(waste[5])
    })
  })
})
