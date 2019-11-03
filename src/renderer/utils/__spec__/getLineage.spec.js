import getLineage from '../getLineage'
import Card from '../../store/models/Card'

describe('getLineage()', () => {
  const cardA = new Card()
  const cardB = new Card()
  const cardC = new Card()
  const cardD = new Card()

  cardA.child = cardB
  cardB.child = cardC
  cardC.child = cardD

  it('should return all descendants (and itself) of the given card', () => {
    expect(getLineage(cardA)).toEqual(expect.arrayContaining([cardB, cardC, cardD]))
  })

  it('should not return any of its ancestors', () => {
    expect(getLineage(cardC)).toEqual(expect.arrayContaining([cardD]))
  })
})
