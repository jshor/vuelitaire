import isKing from './isKing'
import Card from '../../store/models/Card'
import { Suits } from '../../constants'

describe('Rule: isSequential', () => {
  const parent = null

  it('should return true if the parent card is an Ace', () => {
    const child = new Card(Suits.DIAMONDS, 0)

    expect(isKing(parent, child)).toEqual(true)
  })

  it('should return false if the parent card is not an Ace', () => {
    const child = new Card(Suits.DIAMONDS, 1)

    expect(isKing(parent, child)).toEqual(false)
  })
})
