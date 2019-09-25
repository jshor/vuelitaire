import isSequential from './isSequential'
import Card from '../../store/models/Card'
import { Suits } from '../../constants'

describe('Rule: isSequential', () => {
  it('should return true if the parent card is exactly one rank above the child card', () => {
    const parent = new Card(Suits.DIAMONDS, 3)
    const child = new Card(Suits.SPADES, 2)

    expect(isSequential(parent, child)).toEqual(true)
  })

  it('should return false if the parent card is the same rank as the child card', () => {
    const parent = new Card(Suits.DIAMONDS, 3)
    const child = new Card(Suits.SPADES, 3)

    expect(isSequential(parent, child)).toEqual(false)
  })

  it('should return false if the parent card is more than one rank above the child card', () => {
    const parent = new Card(Suits.DIAMONDS, 3)
    const child = new Card(Suits.SPADES, 1)

    expect(isSequential(parent, child)).toEqual(false)
  })

  it('should return false if the parent card is more than one rank below the child card', () => {
    const parent = new Card(Suits.DIAMONDS, 1)
    const child = new Card(Suits.SPADES, 5)

    expect(isSequential(parent, child)).toEqual(false)
  })
})
