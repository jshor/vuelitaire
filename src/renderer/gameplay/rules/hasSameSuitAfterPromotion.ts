import IRule from '../../interfaces/IRule'
import ICard from '../../interfaces/ICard'

const hasSameSuitAfterPromotion: IRule = (parent: ICard, target: ICard): boolean => {
  if (!parent.promoted) {
    return true // skips this check
  }
  return parent.suit === target.suit && !target.child
}

export default hasSameSuitAfterPromotion
