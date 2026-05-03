
import { Card } from '@/types/Card'
import { IRule } from '@/interfaces/IRule'

/**
 * Determines if the child card is a King.
 *
 * @param {Card} parent
 * @param {Card} child
 * @returns {boolean}
 */
export const isKing: IRule = (parent: Card, child?: Card): boolean => {
  return child?.rank === 12
}

