import IRule from '../IRule'
import ICard from '../../types/interfaces/ICard'

const hasSameSuitAfterPromotion: IRule = (parent: ICard, target: ICard): boolean => {
  if (!parent.promoted) {
    return true // skips this check
  }
  return parent.suit === target.suit && !target.child
}

export default hasSameSuitAfterPromotion
