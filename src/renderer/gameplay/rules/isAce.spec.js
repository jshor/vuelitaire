import isAce from './isAce'
import Card from '../../store/models/Card'
import { Suits } from '../../constants'

describe('Rule: isSequential', () => {
  const parent = null

  it('should return true if the parent card is an Ace', () => {
    const child = new Card(Suits.DIAMONDS, 0)

    expect(isAce(parent, child)).toEqual(true)
  })

  it('should return false if the parent card is not an Ace', () => {
    const child = new Card(Suits.DIAMONDS, 1)

    expect(isAce(parent, child)).toEqual(false)
  })
})
