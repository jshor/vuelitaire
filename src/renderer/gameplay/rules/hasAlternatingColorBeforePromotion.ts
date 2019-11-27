import hasAlternatingColor from './hasAlternatingColor'
import IRule from '../../interfaces/IRule'
import ICard from '../../interfaces/ICard'

/**
 * Determines if the parent and child have opposite colors.
 *
 * @remarks This rule is skipped (i.e., returns `true`) if the parent is promoted.
 * @param {ICard} parent
 * @param {ICard} child
 * @returns {boolean}
 */
const hasAlternatingColorBeforePromotion: IRule = (parent: ICard, child: ICard): boolean => {
  if (parent.promoted) {
    return true
  }
  return hasAlternatingColor(parent, child)
}

export default hasAlternatingColorBeforePromotion
