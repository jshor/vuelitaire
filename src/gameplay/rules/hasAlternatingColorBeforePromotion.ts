import { Card } from '@/types/Card'
import { IRule } from '@/interfaces/IRule'
import { hasAlternatingColor } from './hasAlternatingColor'

/**
 * Determines if the parent and child have opposite colors.
 *
 * @remarks This rule is skipped (i.e., returns `true`) if the parent is promoted.
 * @param {Card} parent
 * @param {Card} child
 * @returns {boolean}
 */
export const hasAlternatingColorBeforePromotion: IRule = (parent: Card, child?: Card): boolean => {
  if (parent.promoted) {
    return true
  }
  return hasAlternatingColor(parent, child)
}

