import { Suits } from '@/constants'
import { Card } from '@/types/Card'
import { IRule } from '@/interfaces/IRule'

/**
 * Determines if the parent and child have opposite colors.
 *
 * @param {Card} parent
 * @param {Card} child
 * @returns {boolean}
 */
export const hasAlternatingColor: IRule = (parent: Card, child?: Card): boolean => {
  const isRed = (s?: string): boolean => !!s && [Suits.DIAMONDS, Suits.HEARTS].includes(s)
  const isBlk = (s?: string): boolean => !!s && [Suits.CLUBS, Suits.SPADES].includes(s)

  return isBlk(parent.suit)
    ? isRed(child?.suit)
    : isBlk(child?.suit)
}

