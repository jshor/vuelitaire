import { Suits } from '@/constants'
import Card from '@/models/Card'
import FoundationSpace from '@/models/FoundationSpace'
import LaneSpace from '@/models/LaneSpace'
import isBuildable from '../isBuildable'

describe('Rule: isBuildable', () => {
  let parent: Card
  let child: Card

  beforeEach(() => {
    parent = new Card(Suits.SPADES, 0)
    child = new Card(Suits.HEARTS, 1)
  })

  it('should return false when the child card is not of type Card', () => {
    expect(isBuildable(parent, new LaneSpace())).toEqual(false)
  })

  it('should return false when parent already has a child card', () => {
    parent.child = new Card(Suits.DIAMONDS, 1)

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when the child is the same as the parent', () => {
    expect(isBuildable(parent, parent)).toEqual(false)
  })

  it('should return false when the target card has no parent of itself', () => {
    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return true when the target card has no parent of itself but is a Foundation', () => {
    expect(isBuildable(new FoundationSpace(), child)).toEqual(false)
  })

  it('should return true when the target card has no parent of itself but is a Tableau lane', () => {
    expect(isBuildable(new LaneSpace(), child)).toEqual(false)
  })

  it('should return false when parent card is not yet revealed', () => {
    parent.parent = new Card(Suits.DIAMONDS, 1)
    parent.revealed = false

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when child card is not yet revealed', () => {
    parent.parent = new Card(Suits.DIAMONDS, 1)
    parent.revealed = true
    child.revealed = false

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return true', () => {
    parent.parent = new Card(Suits.DIAMONDS, 1)
    parent.revealed = true
    child.revealed = true

    expect(isBuildable(parent, child)).toEqual(true)
  })
})
