import { Card } from '@/types/Card'
import { IRule } from '@/interfaces/IRule'

/**
 * Determines if the parent and child have matching suits.
 *
 * @remarks This rule is skipped (i.e., returns `true`) if the parent is promoted.
 * @param {Card} parent
 * @param {Card} child
 * @returns {boolean}
 */
export const hasSameSuitAfterPromotion: IRule = (parent: Card, target?: Card): boolean => {
  if (!parent.promoted) {
    return true // skips this check
  }
  return parent.suit === target?.suit && !target?.child
}

