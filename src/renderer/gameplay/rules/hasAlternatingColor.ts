import { Suits } from '../../constants'
import ICard from '../../interfaces/ICard'
import IRule from '../../interfaces/IRule'

/**
 * Determines if the parent and child have opposite colors.
 *
 * @param {ICard} parent
 * @param {ICard} child
 * @returns {boolean}
 */
const hasAlternatingColor: IRule = (parent: ICard, child: ICard): boolean => {
  const isRed = (s: string): boolean => [Suits.DIAMONDS, Suits.HEARTS].includes(s)
  const isBlk = (s: string): boolean => [Suits.CLUBS, Suits.SPADES].includes(s)

  return isBlk(parent.suit)
    ? isRed(child.suit)
    : isBlk(child.suit)
}

export default hasAlternatingColor
