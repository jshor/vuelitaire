import isDescendant from '../isDescendant'
import Card from '../../store/models/Card'

describe('getLineage()', () => {
  const cardA = new Card()
  const cardB = new Card()
  const cardC = new Card()
  const cardD = new Card()

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
