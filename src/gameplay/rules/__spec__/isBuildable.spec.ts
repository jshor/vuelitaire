import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { createCard } from '@/models/Card'
import { isBuildable } from '../isBuildable'
import { isKing } from '../isKing'
import { hasSameSuitAfterPromotion } from '../hasSameSuitAfterPromotion'
import { isAce } from '../isAce'

describe('Rule: isBuildable', () => {
  let parent: Card
  let child: Card

  function createLaneSpace() {
    return createCard({
      revealed: true,
      rules: [isBuildable, isKing],
      type: 'LaneSpace'
    })
  }

  beforeEach(() => {
    parent = createCard({ suit: Suits.CLUBS, rank: 0 })
    child = createCard({ suit: Suits.HEARTS, rank: 1 })
  })

  it('should return false when the child card is not of type Card', () => {
    expect(isBuildable(parent, createLaneSpace())).toEqual(false)
  })

  it('should return false when parent already has a child card', () => {
    parent.child = createCard({ suit: Suits.DIAMONDS, rank: 1 })

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when the child is the same as the parent', () => {
    expect(isBuildable(parent, parent)).toEqual(false)
  })

  it('should return false when the target card has no parent of itself', () => {
    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return true when the target card has no parent of itself but is a Foundation', () => {
    expect(isBuildable(createCard({
      suit: Suits.CLUBS,
      promoted: true,
      revealed: true,
      rules: [isBuildable, isAce, hasSameSuitAfterPromotion],
      type: 'FoundationSpace'
    }), child)).toEqual(false)
  })

  it('should return true when the target card has no parent of itself but is a Tableau lane', () => {
    expect(isBuildable(createLaneSpace(), child)).toEqual(false)
  })

  it('should return false when parent card is not yet revealed', () => {
    parent.parent = createCard({ suit: Suits.DIAMONDS, rank: 1 })
    parent.revealed = false

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return false when child card is not yet revealed', () => {
    parent.parent = createCard({ suit: Suits.DIAMONDS, rank: 1 })
    parent.revealed = true
    child.revealed = false

    expect(isBuildable(parent, child)).toEqual(false)
  })

  it('should return true', () => {
    parent.parent = createCard({ suit: Suits.DIAMONDS, rank: 1 })
    parent.revealed = true
    child.revealed = true

    expect(isBuildable(parent, child)).toEqual(true)
  })
})
