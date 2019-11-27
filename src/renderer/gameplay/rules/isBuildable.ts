import Card from '../../models/Card'
import IRule from '../../interfaces/IRule'
import ICard from '../../interfaces/ICard'

/**
 * Determines if the child can be moved and placed onto the parent.
 *
 * @param {ICard} parent
 * @param {ICard} child
 * @returns {boolean}
 */
const isBuildable: IRule = (parent: ICard, child: ICard): boolean => {
  if (!(child instanceof Card)) {
    return false
  }
  if (parent.child || parent.id === child.id) {
    return false
  }
  if (!parent.isPlayed) {
    return false
  }
  if (!parent.revealed || !child.revealed) {
    return false
  }
  return true
}

export default isBuildable
