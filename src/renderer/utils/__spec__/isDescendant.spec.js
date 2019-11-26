import isDescendant from '../isDescendant'
import Card from '../../models/Card'
import { Suits } from '../../constants'

describe('getLineage()', () => {
  const cardA = new Card(Suits.DIAMONDS, 1)
  const cardB = new Card(Suits.DIAMONDS, 1)
  const cardC = new Card(Suits.DIAMONDS, 1)
  const cardD = new Card(Suits.DIAMONDS, 1)

  cardA.child = cardB
  cardB.child = cardC
  cardC.child = cardD

  it('should return true for all of its descendants', () => {
    expect(isDescendant(cardA, cardB.id)).toBe(true)
    expect(isDescendant(cardA, cardC.id)).toBe(true)
    expect(isDescendant(cardA, cardD.id)).toBe(true)
  })

  it('should return false for an ancestor card', () => {
    expect(isDescendant(cardC, cardB.id)).toBe(false)
  })
})
