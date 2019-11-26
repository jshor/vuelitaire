import isBuildable from '../isBuildable'
import Card from '../../../models/Card'
import { Suits } from '../../../constants'

describe('Rule: isBuildable', () => {
  let parent: Card
  let child: Card

  beforeEach(() => {
    parent = new Card(Suits.SPADES, 0)
    child = new Card(Suits.HEARTS, 1)
  })

  it('should return false when the child card is not of type \'CARD\'', () => {
    child.type = 'SPACE'

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when parent already has a child card', () => {
    parent.child = new Card(Suits.DIAMONDS, 1)

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when the child is the same as the parent', () => {
    expect(isBuildable(parent, parent)).toEqual(false)
  })

  it('should return false when the parent card is not yet in play', () => {
    parent.isPlayed = false

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when parent card is not yet revealed', () => {
    parent.isPlayed = true
    parent.revealed = false

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when child card is not yet revealed', () => {
    parent.isPlayed = true
    parent.revealed = true
    child.revealed = false

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return true', () => {
    parent.isPlayed = true
    parent.revealed = true
    child.revealed = true

    expect(isBuildable(parent, child)).toEqual(true)
  })
})
