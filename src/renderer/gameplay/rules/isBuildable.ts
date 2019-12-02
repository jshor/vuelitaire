import ICard from '@/interfaces/ICard'
import IRule from '@/interfaces/IRule'
import Card from '@/models/Card'
import FoundationSpace from '@/models/FoundationSpace'
import LaneSpace from '@/models/LaneSpace'

/**
 * Determines whether or not the parent card is eligible to receive the child.
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
  if (!(parent.parent || parent instanceof FoundationSpace || parent instanceof LaneSpace)) {
    // if a card has no parent, then it is not in the Tableux or Foundations
    // the exception is if the card is either a FoundationSpace or a LaneSpace
    return false
  }
  if (!parent.revealed || !child.revealed) {
    return false
  }
  return true
}

export default isBuildable
