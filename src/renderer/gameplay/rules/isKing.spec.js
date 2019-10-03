import isKing from './isKing'
import Card from '../../store/models/Card'
import { Suits } from '../../constants'

describe('Rule: isKing', () => {
  const parent = null

  it('should return true if the child card is a King', () => {
    const child = new Card(Suits.DIAMONDS, 12)

    expect(isKing(parent, child)).toEqual(true)
  })

  it('should return false if the child card is not a King', () => {
    const child = new Card(Suits.DIAMONDS, 1)

    expect(isKing(parent, child)).toEqual(false)
  })
})
