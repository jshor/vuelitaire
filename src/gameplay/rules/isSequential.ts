import { Card } from '@/types/Card'
import { IRule } from '@/interfaces/IRule'

/**
 * Determines if the child card is one rank above the parent if promoted, or below otherwise.
 *
 * @param {Card} parent
 * @param {Card} child
 * @returns {boolean}
 */
export const isSequential: IRule = (parent: Card, child?: Card): boolean => {
  const sequence = parent.promoted ? -1 : 1

  return !!child && parent.rank === child.rank + sequence
}

