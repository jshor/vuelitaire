import ICard from '../../interfaces/ICard'
import IRule from '../../interfaces/IRule'

/**
 * Determines if the child card is one rank above the parent if promoted, or below otherwise.
 *
 * @param {ICard} parent
 * @param {ICard} child
 * @returns {boolean}
 */
const isSequential: IRule = (parent: ICard, child: ICard): boolean => {
  const sequence = parent.promoted ? -1 : 1

  return parent.rank === child.rank + sequence
}

export default isSequential
