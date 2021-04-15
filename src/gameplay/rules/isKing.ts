
import ICard from '@/interfaces/ICard'
import IRule from '@/interfaces/IRule'

/**
 * Determines if the child card is a King.
 *
 * @param {ICard} parent
 * @param {ICard} child
 * @returns {boolean}
 */
const isKing: IRule = (parent: ICard, child: ICard): boolean => {
  return child.rank === 12
}

export default isKing
