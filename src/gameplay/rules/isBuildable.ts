import { ICard } from '@/interfaces/ICard'
import { IRule } from '@/interfaces/IRule'

/**
 * Determines whether or not the parent card is eligible to receive the child.
 *
 * @param {ICard} parent
 * @param {ICard} child
 * @returns {boolean}
 */
export const isBuildable: IRule = (parent: ICard, child?: ICard) => {
  if (!child || parent.child || parent.id === child.id) {
    return false
  }

  if (parent.parent?.type === 'DealSpace') {
    return false
  }

  if (!parent.revealed || !child.revealed) {
    return false
  }

  return true
}
