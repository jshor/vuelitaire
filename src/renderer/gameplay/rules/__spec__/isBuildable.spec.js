import isBuildable from '../isBuildable'
import Card from '../../../store/models/Card'

describe('Rule: isBuildable', () => {
  let parent
  let child

  beforeEach(() => {
    parent = new Card()
    child = new Card()
  })

  it('should return false when the child card is not of type \'CARD\'', () => {
    child.type = 'SPACE'

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when parent already has a child card', () => {
    parent.child = new Card()

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
