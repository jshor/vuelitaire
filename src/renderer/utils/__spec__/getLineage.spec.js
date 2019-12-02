import getLineage from '@/getLineage'
import Card from '@/models/Card'
import { Suits } from '@/constants'

describe('getLineage()', () => {
  const cardA = new Card(Suits.DIAMONDS, 1)
  const cardB = new Card(Suits.DIAMONDS, 1)
  const cardC = new Card(Suits.DIAMONDS, 1)
  const cardD = new Card(Suits.DIAMONDS, 1)

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
