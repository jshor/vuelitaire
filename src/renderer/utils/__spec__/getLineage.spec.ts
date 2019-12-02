import { Suits } from '@/constants'
import Card from '@/models/Card'
import getLineage from '../getLineage'

describe('getLineage()', () => {
  const cardA: Card = new Card(Suits.DIAMONDS, 1)
  const cardB: Card = new Card(Suits.DIAMONDS, 1)
  const cardC: Card = new Card(Suits.DIAMONDS, 1)
  const cardD: Card = new Card(Suits.DIAMONDS, 1)

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
