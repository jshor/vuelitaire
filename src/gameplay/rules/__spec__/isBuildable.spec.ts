import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { FoundationSpace } from '@/types/FoundationSpace'
import { createFoundationSpace } from '@/models/FoundationSpace'
import { LaneSpace } from '@/types/LaneSpace'
import { createLaneSpace } from '@/models/LaneSpace'
import { isBuildable } from '../isBuildable'

describe('Rule: isBuildable', () => {
  let parent: Card
  let child: Card

  beforeEach(() => {
    parent = createCard(Suits.SPADES, 0)
    child = createCard(Suits.HEARTS, 1)
  })

  it('should return false when the child card is not of type Card', () => {
    expect(isBuildable(parent, createLaneSpace())).toEqual(false)
  })

  it('should return false when parent already has a child card', () => {
    parent.child = createCard(Suits.DIAMONDS, 1)

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when the child is the same as the parent', () => {
    expect(isBuildable(parent, parent)).toEqual(false)
  })

  it('should return false when the target card has no parent of itself', () => {
    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return true when the target card has no parent of itself but is a Foundation', () => {
    expect(isBuildable(createFoundationSpace(), child)).toEqual(false)
  })

  it('should return true when the target card has no parent of itself but is a Tableau lane', () => {
    expect(isBuildable(createLaneSpace(), child)).toEqual(false)
  })

  it('should return false when parent card is not yet revealed', () => {
    parent.parent = createCard(Suits.DIAMONDS, 1)
    parent.revealed = false

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when child card is not yet revealed', () => {
    parent.parent = createCard(Suits.DIAMONDS, 1)
    parent.revealed = true
    child.revealed = false

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return true', () => {
    parent.parent = createCard(Suits.DIAMONDS, 1)
    parent.revealed = true
    child.revealed = true

    expect(isBuildable(parent, child)).toEqual(true)
  })
})
