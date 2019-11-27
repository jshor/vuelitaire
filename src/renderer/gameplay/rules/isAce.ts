
import IRule from '../../interfaces/IRule'
import ICard from '../../interfaces/ICard'

/**
 * Determines if the child card is an Ace.
 *
 * @param {ICard} parent
 * @param {ICard} child
 * @returns {boolean}
 */
const isAce: IRule = (parent: ICard, child: ICard): boolean => {
  return child.rank === 0
}

export default isAce
