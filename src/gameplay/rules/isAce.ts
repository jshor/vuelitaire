
import { Card } from '@/types/Card'
import { IRule } from '@/interfaces/IRule'

/**
 * Determines if the child card is an Ace.
 *
 * @param {Card} parent
 * @param {Card} child
 * @returns {boolean}
 */
export const isAce: IRule = (parent: Card, child?: Card): boolean => {
  return child?.rank === 0
}

