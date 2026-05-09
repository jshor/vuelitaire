import { Card } from '@/types/Card'
import { IRule } from '@/interfaces/IRule'

/**
 * Determines whether or not the parent card is eligible to receive the child.
 *
 * @param {Card} parent
 * @param {Card} child
 * @returns {boolean}
 */
export const isBuildable: IRule = (parent: Card, child?: Card) => {
  if (!child || child.type !== 'Card') {
    return false
  }

  if (parent.child || parent.id === child.id) {
    return false
  }

  if (parent.type === 'FoundationSpace') {
    return true
  }

  if (!parent.parent || parent.parent.type === 'DealSpace') {
    return false
  }

  if (!parent.revealed || !child.revealed) {
    return false
  }

  return true
}
