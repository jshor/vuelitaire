import ICard from '../../interfaces/ICard'
import IRule from '../../interfaces/IRule'

/**
 * Determines if the parent and child have matching suits.
 *
 * @remarks This rule is skipped (i.e., returns `true`) if the parent is promoted.
 * @param {ICard} parent
 * @param {ICard} child
 * @returns {boolean}
 */
const hasSameSuitAfterPromotion: IRule = (parent: ICard, target: ICard): boolean => {
  if (!parent.promoted) {
    return true // skips this check
  }
  return parent.suit === target.suit && !target.child
}

export default hasSameSuitAfterPromotion
